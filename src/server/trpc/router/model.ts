import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  getAllDriveFilesIn,
  GoogleDriveFile,
} from "../../../utils/drive-utils";

export const modelRouter = router({
  createModel: publicProcedure
    .input(
      z.object({
        name: z.string(),
        stlId: z.string(),
        binvoxId: z.string().optional(),
        folderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.model.create({
        data: {
          name: input.name,
          stlId: input.stlId,
          binvoxId: input.binvoxId,
          folderId: input.folderId,
        },
      });
    }),

  getModel: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.model.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  searchModels: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.model.findMany({
        where: {
          name: {
            contains: input.query,
          },
        },
        orderBy: {
          id: "asc",
        },
        take: input.limit,
      });
    }),

  // Syncs the models in the database with the models in the given Google Drive folder.
  syncModelsInFolder: publicProcedure
    .input(
      z.object({
        folderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const nameToIds = new Map<string, PrismaModelFile>();
      function trimFileExtension(name: string) {
        return name.split(".").slice(0, -1).join(".");
      }

      const files = await getAllDriveFilesIn(input.folderId);
      if (files.length === 0) {
        console.warn(`No files found in folder ${input.folderId}, returning`);
        return 0;
      }
      const stlFolder = files.find((file: GoogleDriveFile) =>
        file.name.includes("rotated_files")
      );
      if (!stlFolder) {
        console.warn(`No STL folder found for id ${input.folderId}`);
      }
      const stlFolderId = stlFolder ? stlFolder.id : input.folderId;
      const binvoxFolder = files.find((file: GoogleDriveFile) =>
        file.name.includes("Binvox_files_default_res")
      );
      if (!binvoxFolder) {
        console.warn(`No binvox folder found for id ${input.folderId}`);
      }
      const binvoxFolderId = binvoxFolder ? binvoxFolder.id : input.folderId;
      const stlFiles = await getAllDriveFilesIn(stlFolderId);
      // console.log("stl length: " + stlFiles.length);
      const binvoxFiles = await getAllDriveFilesIn(binvoxFolderId);
      // console.log("binvox: " + binvoxFiles.length);
      stlFiles
        .filter((file: GoogleDriveFile) => {
          return file.mimeType === "application/vnd.ms-pki.stl";
        })
        .forEach((file: GoogleDriveFile) => {
          nameToIds.set(trimFileExtension(file.name), {
            name: trimFileExtension(file.name),
            stlId: file.id,
            folderId: input.folderId,
          });
        });

      binvoxFiles
        .filter((file: GoogleDriveFile) => {
          return file.mimeType === "application/octet-stream";
        })
        .forEach((file: GoogleDriveFile) => {
          const stlAndBinvox = nameToIds.get(trimFileExtension(file.name));
          if (stlAndBinvox) {
            stlAndBinvox.binvoxId = file.id;
          }
        });

      const data = Array.from(nameToIds.values());
      // console.log(data.length);
      data.sort((a, b) => a.name.localeCompare(b.name));

      // partition the data into batches to prevent prisma errors
      const BATCH_SIZE = 5000;

      let totalCount = 0;
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch: Array<PrismaModelFile> = data.slice(i, i + BATCH_SIZE);
        try {
          totalCount += await ctx.prisma.model
            .createMany({
              data: batch,
              skipDuplicates: true,
            })
            .then((batch: Prisma.BatchPayload) => batch.count);
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2034") {
              // deadlock or write conflict
              console.warn("Deadlock detected, retrying this batch");
              i -= BATCH_SIZE;
              continue;
            }
          } else {
            throw e;
          }
        }
      }
      return totalCount;
    }),

  getFewestRatingModel: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.model.findFirst({
      orderBy: {
        Rating: {
          _count: "asc",
        },
      },
    });
  }),
});

interface PrismaModelFile {
  name: string;
  stlId: string;
  binvoxId?: string;
  folderId: string;
}
