import type { GraphQLContext } from '../context.js';

export const collectionResolvers = {
  Query: { // run qureys to connect to perform crud(not all) + find collections(folders)
    collections: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      return context.prisma.collection.findMany({ // find all collection(folder)
        orderBy: { createdAt: 'desc' },
      });
    },
    collection: async (_parent: unknown, args: { id: string }, context: GraphQLContext) => {
      // Returns null if not found (idiomatic GraphQL)
      return context.prisma.collection.findUnique({ // find one collectin(folder)
        where: { id: args.id },
      });
    },
  },
  Mutation: {
    createCollection: async (
      _parent: unknown,
      args: { name: string; slug: string },
      context: GraphQLContext
    ) => {
      const { validateSlug } = await import('../validation/rules.js');
      const { badInput } = await import('../errors/errors.js');
      
      validateSlug(args.slug);

      try {
        return await context.prisma.collection.create({
          data: {
            name: args.name,
            slug: args.slug,
          },
        });
      } catch (error: any) {
        // Prisma throws P2002 if a unique constraint fails (e.g., duplicate slug)
        if (error.code === 'P2002') {
          throw badInput(`A collection with the slug '${args.slug}' already exists.`);
        }
        throw error;
      }
    },
  },
  // We resolve the nested 'documents' field directly on the Collection type
  // This tells GraphQL how to get documents when someone asks for a collection's documents
  Collection: { // find document(files) inside collection(folder)
    documents: async (parent: { id: string }, _args: unknown, context: GraphQLContext) => {
      return context.prisma.document.findMany({ // find all files
        where: { collectionId: parent.id },
        orderBy: { createdAt: 'desc' },
      });
    },
  },
};
