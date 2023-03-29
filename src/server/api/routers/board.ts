import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const boardRouter = createTRPCRouter({
  getBoardsByUserID: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.board.findMany({
        where: {
          userId: ctx.session.user.id
        }
      });
    }),

  getBoardByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findUnique({
        where: {
          id: input.id
        },
        include: {
          columns: {
            include: {
              tasks: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });
    }),

  getTaskByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          id: input.id
        }
      });
    }),

  removeTaskByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: {
          id: input.id
        }
      });
    }),

  removeColumnByID: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.column.delete({
        where: {
          id: input.id
        }
      });
    }),

  createColumn: protectedProcedure
    .input(z.object({
      boardId: z.string(),
      order: z.number(),
      title: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.column.create({
        data: {
          boardId: input.boardId,
          order: input.order,
          title: input.title
        },
        include: {
          tasks: true
        }
      });
    }),

  dragTask: protectedProcedure
    .input(z.object({
      id: z.string(),
      endColumnId: z.string(),
      endColumnPosition: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          columnId: input.endColumnId,
          order: input.endColumnPosition
        }
      });
    }),

  createTask: protectedProcedure
    .input(z.object({
      columnId: z.string(),
      title: z.string(),
      description: z.string(),
      order: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          columnId: input.columnId,
          title: input.title,
          description: input.description,
          order: input.order
        }
      });
    }),

  updateTask: protectedProcedure
    .input(z.object({
      id: z.string(),
      columnId: z.string(),
      title: z.string(),
      description: z.string()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id
        },
        data: {
          columnId: input.columnId,
          title: input.title,
          description: input.description
        }
      });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ ctx, input }) => {
      const result = ctx.prisma.board.create({
        data: {
          name: input.title,
          userId: ctx.session.user.id
        }
      });

      console.log(result);

      return result;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.delete({
        where: {
          id: input.id
        }
      });
    })
});