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

  // returns the number of files added to the database
  syncModels: publicProcedure.mutation(async ({ ctx }) => {
    const URAP3D_STL = "1P0k67JaVkJRyFysUC_G8bKmRQQD_TKhq"; // Urap3d/STL
    const CAD_PARTS_FOLDER = "1kvid8nlRhSFrnIzrZbjt5uOOuEixPBpN"; // CAD parts folder

    const PARTS_0_1_3950 = "1rIlKhyHHyQ55RW8igH7ywnH0hXMLDwA_"; // done
    const PARTS_0_3951_5450 = "1cKpVz3Vol2F8-i-V6ixnGkH94Al8VsjP"; // done
    const PARTS_0_5451_9606 = "1CkJ30EDPfz8g0okPQPW19vkoqzdClYg8"; // done
    const PARTS_1_1_2500 = "1j_J4PxkVZlfP7kqhP4JwyUG29bYVLbNJ"; // done
    const PARTS_1_2501_7500 = "155SmkUlp2Z8nVb_VjUgoTNPRMO1jl9gQ"; // done
    const PARTS_1_7501_11227 = "1ZtDlxIVOq_B6gbryrtXZTQXJpv3bodEv"; // done
    const PARTS_2_1_3500 = "1Ju7G3RB-KLtC4i8drcGdN2YEcUczueov"; // done
    const PARTS_2_3501_7500 = "1kUIWVdyryIcETdOQik29T1DPVZAWJ9-a"; // done
    const PARTS_2_7501_11076 = "1ZwfiDKMlHZgpgZOOJhqBUwQnBFjXQhZd"; // done
    const PARTS_3_1_5500 = "19rsrWC1dmBtCD9uPJCC5QdwOWD7VYeY7"; // done
    const PARTS_3_5501_10844 = "1GOTtPLaxOlAguBdNuKfpeLn8UuA5OCxA"; // done

    const FOLDER_ID = PARTS_3_5501_10844;

    const PRISMA_BATCH_SIZE = 5000;

    const nameToId = new Map<string, PrismaModelFile>();
    function trimFileExtension(name: string) {
      return name.split(".").slice(0, -1).join(".");
    }

    const files = await getAllDriveFilesIn(FOLDER_ID);
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
