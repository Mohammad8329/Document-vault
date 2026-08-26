import type { GraphQLContext } from '../context.js';
import { validateTitle, validateContent } from '../validation/rules.js';
import { notFound } from '../errors/errors.js';

export const documentResolvers = {
  Mutation: {
    createDocument: async (
      _parent: unknown,
      args: { collectionId: string; title: string; content: string; tags?: string[] },
      context: GraphQLContext
    ) => {
      validateTitle(args.title);
      validateContent(args.content);

      // Verify the collection exists before creating the document
      const collection = await context.prisma.collection.findUnique({
        where: { id: args.collectionId },
      });

      if (!collection) {
        throw notFound('Collection', args.collectionId);
      }

      return context.prisma.document.create({
        data: {
          title: args.title,
          content: args.content,
          tags: args.tags ?? [],
          collectionId: args.collectionId,
        },
      });
    },

    updateDocument: async (
      _parent: unknown,
      args: { id: string; title?: string; content?: string; tags?: string[]; isArchived?: boolean },
      context: GraphQLContext
    ) => {
      validateTitle(args.title);
      validateContent(args.content);

      try {
        return await context.prisma.document.update({
          where: { id: args.id },
          data: {
            ...(args.title !== undefined && { title: args.title }),
            ...(args.content !== undefined && { content: args.content }),
            ...(args.tags !== undefined && { tags: args.tags }),
            ...(args.isArchived !== undefined && { isArchived: args.isArchived }),
          },
        });
      } catch (error: any) {
        // Prisma throws P2025 if the record to update is not found
        if (error.code === 'P2025') {
          throw notFound('Document', args.id);
        }
        throw error;
      }
    },

    deleteDocument: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      try {
        await context.prisma.document.delete({
          where: { id: args.id },
        });
        return true;
      } catch (error: any) {
        if (error.code === 'P2025') {
          throw notFound('Document', args.id);
        }
        throw error;
      }
    },
  },
};
