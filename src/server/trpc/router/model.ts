import { router, publicProcedure } from "../trpc";
import { env } from "../../../env/client.mjs";
import { z } from "zod";
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
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.model.create({
        data: {
          name: input.name,
          stlId: input.stlId,
          binvoxId: input.binvoxId,
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
    .query(({ ctx, input }) => {
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
  syncModels: publicProcedure
  .input(
    z.object({
        folderId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const PRISMA_BATCH_SIZE = 5000;

    const nameToId = new Map<string, PrismaModelFile>();
    function trimFileExtension(name: string) {
      return name.split(".").slice(0, -1).join(".");
    }

    const files = await getAllDriveFilesIn(input.folderId);
    if (files.length === 0) {
      throw new Error("No files found");
    }
    const stlFolder = files.find((file: GoogleDriveFile) =>
      file.name.includes("rotated_files")
    );
    if (!stlFolder) {
      throw new Error("No STL folder found");
    }
    const stlFolderId = stlFolder.id;
    const binvoxFolder = files.find((file: GoogleDriveFile) =>
      file.name.includes("Binvox_files_default_res")
    );
    if (!binvoxFolder) {
      throw new Error("No STL folder found");
    }
    const binvoxFolderId = binvoxFolder.id;
    const stlFiles = await getAllDriveFilesIn(stlFolderId);
    // console.log("stl length: " + stlFiles.length);
    const binvoxFiles = await getAllDriveFilesIn(binvoxFolderId);
    // console.log("binvox: " + binvoxFiles.length);
    stlFiles
      .filter((file: GoogleDriveFile) => {
        return file.mimeType === "application/vnd.ms-pki.stl";
      })
      .forEach((file: GoogleDriveFile) => {
        nameToId.set(trimFileExtension(file.name), {
          name: trimFileExtension(file.name),
          stlId: file.id,
        });
      });

    binvoxFiles
      .filter((file: GoogleDriveFile) => {
        return file.mimeType === "application/octet-stream";
      })
      .forEach((file: GoogleDriveFile) => {
        const stlAndBinvox = nameToId.get(trimFileExtension(file.name));
        if (stlAndBinvox) {
          stlAndBinvox.binvoxId = file.id;
        }
      });

    const data = Array.from(nameToId.values());
    // console.log(data.length);
    data.sort((a, b) => a.name.localeCompare(b.name));

    // partition the data into batches
    const batches = [];
    for (let i = 0; i < data.length; i += PRISMA_BATCH_SIZE) {
      batches.push(data.slice(i, i + PRISMA_BATCH_SIZE));
    }

    let totalCount = 0;
    for (const batch of batches) {
      totalCount += await ctx.prisma.model
        .createMany({
          data: batch,
          skipDuplicates: true,
        })
        .then((batch) => batch.count);
    }
    return totalCount;
  }),
});

interface PrismaModelFile {
  name: string;
  stlId: string;
  binvoxId?: string;
}
