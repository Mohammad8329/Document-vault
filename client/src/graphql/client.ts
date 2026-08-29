import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          documents: {
            // Support cursor pagination merging if needed
            keyArgs: ['collectionId', 'search', 'isArchived'],
            merge(existing, incoming, { args }) {
              if (!args?.after) {
                return incoming;
              }
              const existingEdges = existing?.edges || [];
              const incomingEdges = incoming?.edges || [];
              return {
                ...incoming,
                edges: [...existingEdges, ...incomingEdges],
              };
            },
          },
        },
      },
    },
  }),
});
