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
