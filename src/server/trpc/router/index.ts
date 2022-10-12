// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { modelsRouter } from "./models";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  models: modelsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
