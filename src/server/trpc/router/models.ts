import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const modelsRouter = router({
    createModel: publicProcedure
        .input(z.object({
            name: z.string(),
            stlLink: z.string().optional(),
            binvoxLink: z.string().optional(),
            vizLink: z.string().optional(),
        }))
        .mutation(({ ctx, input }) => {
            return ctx.prisma.model.create({
                data: {
                    name: input.name,
                    stlLink: input.stlLink,
                    binvoxLink: input.binvoxLink,
                    vizLink: input.vizLink,
                },
            });
        }),
});
