import { collectionResolvers } from './collection.resolvers.js';
import { documentResolvers } from './document.resolvers.js';

export const resolvers = {
  Query: {
    ...collectionResolvers.Query,
    ...documentResolvers.Query,
  },
  Mutation: {
    ...collectionResolvers.Mutation,
    ...documentResolvers.Mutation,
  },
  Collection: {
    ...collectionResolvers.Collection,
  },
};
