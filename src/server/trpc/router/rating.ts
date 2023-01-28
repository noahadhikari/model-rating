import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const ratingRouter = router({
  createRating: protectedProcedure
    .input(
      z.object({
        modelId: z.number(),
        score: z.number().min(-2).max(2),
        reasoning: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.rating.create({
        data: {
          score: input.score,
          reasoning: input.reasoning,
          model: {
            connect: {
              id: input.modelId,
            },
          },
          creator: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    }),
});
