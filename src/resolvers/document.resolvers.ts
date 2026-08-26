import type { GraphQLContext } from '../context.js';
import { validateTitle, validateContent } from '../validation/rules.js';
import { notFound } from '../errors/errors.js';

export const documentResolvers = {
  Query: {
    documents: async (
      _parent: unknown,
      args: { collectionId?: string; search?: string; isArchived?: boolean; take?: number; after?: string },
      context: GraphQLContext
    ) => {
      const take = args.take ?? 20;
      
      const where: any = {};
      if (args.collectionId) where.collectionId = args.collectionId;
      if (args.isArchived !== undefined) where.isArchived = args.isArchived;
      if (args.search) {
        where.OR = [
          { title: { contains: args.search, mode: 'insensitive' } },
          { content: { contains: args.search, mode: 'insensitive' } },
        ];
      }

      let cursorObj: any = undefined;
      let skip = 0;
      
      if (args.after) {
        // Decode cursor from base64
        const decoded = Buffer.from(args.after, 'base64').toString('utf-8');
        const [createdAtStr, id] = decoded.split('_');
        if (createdAtStr && id) {
          cursorObj = { createdAt_id: { createdAt: new Date(createdAtStr), id } };
          skip = 1; // skip the cursor itself
        }
      }

      const documents = await context.prisma.document.findMany({
        where,
        take: take + 1, // ask for 1 more to check if there is a next page
        skip,
        cursor: cursorObj,
        orderBy: [
          { createdAt: 'desc' },
          { id: 'asc' }, // tiebreaker
        ],
      });

      const hasNextPage = documents.length > take;
      const nodes = hasNextPage ? documents.slice(0, -1) : documents;

      const edges = nodes.map((node) => ({
        node,
        cursor: Buffer.from(`${node.createdAt.toISOString()}_${node.id}`).toString('base64'),
      }));

      const endCursor = edges.length > 0 ? edges[edges.length - 1]?.cursor ?? null : null;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor,
        },
      };
    },
  },
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

    moveDocument: async (_parent: unknown, args: { id: string; collectionId: string }, context: GraphQLContext) => {
      const collection = await context.prisma.collection.findUnique({
        where: { id: args.collectionId },
      });
      if (!collection) {
        throw notFound('Collection', args.collectionId);
      }

      try {
        return await context.prisma.document.update({
          where: { id: args.id },
          data: { collectionId: args.collectionId },
        });
      } catch (error: any) {
        if (error.code === 'P2025') {
          throw notFound('Document', args.id);
        }
        throw error;
      }
    },
  },
};
