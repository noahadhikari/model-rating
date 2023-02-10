import { router, protectedProcedure, publicProcedure } from "../trpc";
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

  // Take an array of ratings and create them all at once
  importRatings: protectedProcedure
    .input(
      z.array(
        z.object({
          modelName: z.string(),
          score: z.number().min(-2).max(2),
          reasoning: z.string().optional(),
        })
      )
    )

    .mutation(async ({ ctx, input }) => {
      // Get the model ids from the model names and add them to the input
      //   const newInput = await Promise.all(
      //     input.map(async (rating) => {
      //       const model = await ctx.prisma.model.findFirst({
      //         where: {
      //           name: rating.modelName,
      //         },
      //       });
      //       if (!model) {
      //         throw new Error("Model not found: " + rating.modelName);
      //       }
      //       return {
      //         ...rating,
      //         modelId: model.id,
      //       };
      //     })
      //   );

      const newInput = [];
      let i = 0;
      for (const rating of input) {
        const model = await ctx.prisma.model.findFirst({
          where: {
            name: rating.modelName,
          },
        });
        if (!model) {
          continue;
        }
        newInput.push({
          ...rating,
          modelId: model.id,
        });
      }
      const data = await ctx.prisma.rating.createMany({
        data: newInput.map((rating) => {
          return {
            modelId: rating.modelId,
            userId: ctx.session.user.id,
            score: rating.score,
            reasoning: rating.reasoning,
          };
        }),
        skipDuplicates: true,
      });
    }),

  getAllRatings: publicProcedure.query(async ({ ctx }) => {
    const ratings = await ctx.prisma.rating.findMany();
    // Add the model name and stlId to the rating
    const ratingsWithModel = await Promise.all(
      ratings.map(async (rating) => {
        const model = await ctx.prisma.model.findFirst({
          where: {
            id: rating.modelId,
          },
        });
        if (!model) {
          throw new Error("Model not found");
        }
        return {
          ...rating,
          modelName: model.name,
          stlId: model.stlId,
        };
      })
    );
    return ratingsWithModel;
  }),
});
