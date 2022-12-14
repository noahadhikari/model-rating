// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { modelRouter } from "./model";
import { ratingRouter } from "./rating";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  model: modelRouter,
  rating: ratingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
