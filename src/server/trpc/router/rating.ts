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

  getModelRatingByUser: protectedProcedure
    .input(z.object({ modelId: z.number() }))
    .query(async ({ ctx, input }) => {
      const rating = await ctx.prisma.rating.findFirst({
        where: {
          modelId: input.modelId,
          userId: ctx.session.user.id,
        },
      });
      return rating;
    }),

  createRatingFromName: protectedProcedure
    .input(
      z.object({
        modelName: z.string(),
        score: z.number().min(-2).max(2),
        reasoning: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const model = await ctx.prisma.model.findFirst({
        where: {
          name: {
            contains: input.modelName,
          },
        },
      });
      if (!model) {
        console.log("Model not found: " + input.modelName);
        return;
      }

      await ctx.prisma.rating.create({
        data: {
          score: input.score,
          reasoning: input.reasoning,
          model: {
            connect: {
              id: model.id,
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
      console.log(newInput);
      console.log(newInput.length);
      //   const data = await ctx.prisma.rating.createMany({
      //     data: newInput.map((rating) => {
      //       return {
      //         modelId: rating.modelId,
      //         userId: ctx.session.user.id,
      //         score: rating.score,
      //         reasoning: rating.reasoning,
      //       };
      //     }),
      //     skipDuplicates: true,
      //   });
    }),

  //   getAllRatingsWithPage: publicProcedure.input(
  // 	z.object({
  // 	  modelName: z.string(),
  // 	  score: z.number().min(-2).max(2),
  // 	  reasoning: z.string().optional(),
  // 	})
  //   ),

  getRatingsWithPage: publicProcedure
    .input(z.object({ page: z.number() }))
    .query(async ({ ctx, input }) => {
      // Page size is 50
      const ratings = await ctx.prisma.rating.findMany({
        skip: (input.page - 1) * 50,
        take: 50,
        orderBy: { id: "asc" },
      });
      // Add the model name and stlId and binVoxId to the rating
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
            binVoxId: model.binvoxId,
            folderId: model.folderId,
          };
        })
      );
      return ratingsWithModel;
    }),

  getAllRatings: publicProcedure.query(async ({ ctx }) => {
    const ratings = await ctx.prisma.rating.findMany();
    // Add the model name and stlId and binVoxId to the rating
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
          binVoxId: model.binvoxId,
          folderId: model.folderId,
        };
      })
    );
    return ratingsWithModel;
  }),

  importAutoRatings: publicProcedure
    .input(
      z.array(
        z.object({
          modelName: z.string(),
          score: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const modelsNotFound: string[] = [];

      // createMany needs primary key, so we need to get the model id from the model name
      console.log("Creating new input");
      const newInput = await Promise.all(
        input.map(async (rating) => {
          // Remove everything after the last dot
          const modelName = rating.modelName.split(".").slice(0, -1).join(".");
          const model = await ctx.prisma.model.findFirst({
            where: { name: modelName },
          });
          if (!model) {
            modelsNotFound.push(rating.modelName);
            return undefined;
          }
          return {
            ...rating,
            modelId: model.id,
          };
        })
      );

      // Remove the undefined values
      console.log("Filtering new input of undefined values");
      let filteredInput = newInput.filter((rating) => rating !== undefined) as {
        modelName: string;
        score: string;
        modelId: number;
      }[];

      // Filter out the ratings that are already in the database and tweakerScore is not null
      console.log("Filtering duplicate ratings");
      const existingRatings = await ctx.prisma.rating.findMany({
        where: {
          modelId: {
            in: filteredInput.map((rating) => rating.modelId),
          },
          tweakerScore: {
            not: null,
          },
        },
      });

      const existingModelIds = existingRatings.map((rating) => rating.modelId);
      filteredInput = filteredInput.filter(
        (rating) => !existingModelIds.includes(rating.modelId)
      );

      console.log("Starting to create ratings");
      await ctx.prisma.rating.createMany({
        data: filteredInput.map((rating) => {
          return {
            modelId: rating.modelId,
            userId: ctx.session?.user?.id ?? "",
            tweakerScore: parseFloat(rating.score),
            reasoning: "Tweaker",
          };
        }),
      });
      console.log("Finished creating " + filteredInput.length + " ratings");
      console.log("Models not found: " + modelsNotFound);
    }),

  removeDuplicateAutoRatings: publicProcedure.mutation(async ({ ctx }) => {
    const allAutoRatings = await ctx.prisma.rating.findMany({
      where: {
        tweakerScore: {
          not: null,
        },
      },
    });

    const modelIds = allAutoRatings.map((rating) => rating.modelId);
    // console.log(modelIds.sort())
  }),
});
