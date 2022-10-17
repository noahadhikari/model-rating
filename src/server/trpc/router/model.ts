import { router, publicProcedure } from "../trpc";
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
});
