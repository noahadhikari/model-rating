// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { modelRouter } from "./model";
import { ratingRouter } from "./rating";

export const appRouter = router({
  auth: authRouter,
  model: modelRouter,
  rating: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
