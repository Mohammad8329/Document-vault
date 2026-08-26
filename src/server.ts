import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createYoga, createSchema } from 'graphql-yoga';
import { resolvers } from './resolvers/index.js';
import { createContext } from './context.js';

// Get the directory name for the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Read the GraphQL SDL file
const typeDefs = readFileSync(join(__dirname, 'schema', 'schema.graphql'), 'utf-8');

// Build the GraphQL schema combining types and resolvers
const schema = createSchema({
  typeDefs,
  resolvers,
});

// Create the Yoga instance
export const yoga = createYoga({
  schema,
  context: createContext,
});

// Pass it into a standard Node.js HTTP server
const server = createServer(yoga);

const PORT = 4000;
server.listen(PORT, () => {
  console.info(`🚀 GraphQL Server is running on http://localhost:${PORT}/graphql`);
});
