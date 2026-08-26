import { GraphQLError } from 'graphql';

export function badInput(message: string): GraphQLError {
  return new GraphQLError(message, {
    extensions: {
      code: 'BAD_USER_INPUT',
    },
  });
}

export function notFound(entity: string, id: string): GraphQLError {
  return new GraphQLError(`${entity} with ID '${id}' not found.`, {
    extensions: {
      code: 'NOT_FOUND',
    },
  });
}
