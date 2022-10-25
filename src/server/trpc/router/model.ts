import { router, publicProcedure } from "../trpc";
import { env } from "../../../env/client.mjs";
import { z } from "zod";

export const modelRouter = router({
    createModel: publicProcedure
        .input(z.object({
            name: z.string(),
            stlId: z.string(),
            binvoxId: z.string().optional(),
        }))
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
        .input(z.object({
            id: z.number(),
        }))
        .query(({ ctx, input }) => {
            return ctx.prisma.model.findUnique({
                where: {
                    id: input.id,
                },
            });
        }),

    syncModels: publicProcedure
        .mutation(async ({ ctx }) => {
            const FOLDER_ID = "1P0k67JaVkJRyFysUC_G8bKmRQQD_TKhq"
            const allModelsInDriveFolder = await fetch("https://www.googleapis.com/drive/v3/files?q=\"" +
                FOLDER_ID + "\"" + "+in+parents&key=" +
                env.NEXT_PUBLIC_GOOGLE_API_KEY)
                .then(res => {
                    res.json()
                        .then(async (result) => {
                            const allFiles = result.files.map((file: GoogleDriveFile) => {
                                return {
                                    name: file.name,
                                    stlId: file.id,
                                }
                            });
                            // console.log(allFiles);
                            await ctx.prisma.model.createMany({
                                data: allFiles,
                                skipDuplicates: true,
                            })
                        });
                });
            
            


        }),
});

interface GoogleDriveFile {
    kind: string;
    id: string;
    name: string;
    mimeType: string;
}
