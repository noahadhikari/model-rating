// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/trpc/router";
import { createContext } from "../../../server/trpc/context";
import { env } from "../../../env/server.mjs";

// export API handler
export default createNextApiHandler({
    router: appRouter,
    createContext,
    onError:
        env.NODE_ENV === "development"
            ? ({ path, error }) => {
                console.error(`❌ tRPC failed on ${path}: ${error}`);
            }
            : undefined,
    // onError({ error, type, path, input, ctx, req }) {
    //     console.log('Error:', error.message);
    //     if (error.code === 'INTERNAL_SERVER_ERROR') {
    //       // send to bug reporting
    //     }
    //   },

});
