import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { yoga } from '../../src/server.js';
import { prisma } from '../../src/prisma.js';

describe('Integration: GraphQL Roundtrip', () => {
  // Clean up the database before running the tests to ensure a clean slate
  beforeAll(async () => {
    await prisma.document.deleteMany();
    await prisma.collection.deleteMany();
  });

  afterAll(async () => {
    // Close the prisma connection when done
    await prisma.$disconnect();
  });

  it('performs a full create -> fetch roundtrip against the real database', async () => {
    // 1. Create a collection
    const createColResponse = await yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation {
            createCollection(name: "Integration Test", slug: "integration-test") {
              id
              name
            }
          }
        `,
      }),
    });
    
    const colJson = await createColResponse.json();
    expect(colJson.errors).toBeUndefined();
    const collectionId = colJson.data.createCollection.id;
    expect(collectionId).toBeDefined();

    // 2. Create a document in that collection
    const createDocResponse = await yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation($collectionId: ID!) {
            createDocument(collectionId: $collectionId, title: "Test Doc", content: "Test Content") {
              id
              title
            }
          }
        `,
        variables: { collectionId },
      }),
    });

    const docJson = await createDocResponse.json();
    expect(docJson.errors).toBeUndefined();
    const documentId = docJson.data.createDocument.id;
    expect(documentId).toBeDefined();

    // 3. Query the collection to ensure the document is nested correctly
    const queryResponse = await yoga.fetch('http://yoga/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query($id: ID!) {
            collection(id: $id) {
              id
              name
              documents {
                id
                title
                content
              }
            }
          }
        `,
        variables: { id: collectionId },
      }),
    });

    const queryJson = await queryResponse.json();
    expect(queryJson.errors).toBeUndefined();
    
    const fetchedCollection = queryJson.data.collection;
    expect(fetchedCollection.name).toBe('Integration Test');
    expect(fetchedCollection.documents).toHaveLength(1);
    expect(fetchedCollection.documents[0].title).toBe('Test Doc');
    expect(fetchedCollection.documents[0].content).toBe('Test Content');
  });
});
