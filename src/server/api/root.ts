import { createTRPCRouter } from "~/server/api/trpc";
import { boardRouter } from "~/server/api/routers/board";

export const appRouter = createTRPCRouter({
  board: boardRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
