import { collectionResolvers } from './collection.resolvers.js';
// We'll import documentResolvers later in Phase 5

export const resolvers = {
  Query: {
    ...collectionResolvers.Query,
  },
  Mutation: {
    // We will add mutations here in Phase 5
  },
  Collection: {
    ...collectionResolvers.Collection,
  },
};
