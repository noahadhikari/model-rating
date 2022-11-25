import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { IsBestOrientation } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const ratingRouter = router({
    createRating: publicProcedure
        .input(z.object({
            modelId: z.number(),
            author: z.string(),
            bestPossible: z.nativeEnum(IsBestOrientation),
            quality: z.number().min(-2).max(2),
            reasoningPositive: z.string().optional(),
            reasoningNegative: z.string().optional(),

        }))
        .mutation(({ ctx, input }) => {
            console.log(input);
            //find the model associated with the modelId in the model table
            const model = ctx.prisma.model.findUnique({
                where: {
                    id: input.modelId
                }
            })
            .then(m => {
                if (m) {
                    return ctx.prisma.rating.create({
                        data: {
                            model: {
                                connect: {
                                    id: input.modelId,
                                },
                            },
                            author: input.author,
                            bestPossible: input.bestPossible,
                            quality: input.quality,
                            reasoningPositive: input.reasoningPositive,
                            reasoningNegative: input.reasoningNegative,
                        },
                    });
                } else {
                    // throw new TRPCError({
                    //     code: "BAD_REQUEST",
                    //     message: "Model not found for modelId of " + input.modelId,
                    // });
                    return null;
                }
            });
        }),
});
