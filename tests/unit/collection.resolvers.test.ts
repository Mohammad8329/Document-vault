import { describe, it, expect, mock } from 'bun:test';
import { collectionResolvers } from '../../src/resolvers/collection.resolvers.js';
import type { GraphQLContext } from '../../src/context.js';

describe('Collection Resolvers', () => {
  describe('Query.collections', () => {
    it('returns a list of collections', async () => {
      const mockCollections = [{ id: '1', name: 'Test', slug: 'test', createdAt: new Date() }];
      
      const mockContext = {
        prisma: {
          collection: {
            findMany: mock(async () => mockCollections),
          }
        }
      } as unknown as GraphQLContext;

      const result = await collectionResolvers.Query.collections({}, {}, mockContext);
      
      expect(mockContext.prisma.collection.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCollections);
    });
  });

  describe('Mutation.createCollection', () => {
    it('successfully creates a collection', async () => {
      const mockCollection = { id: '1', name: 'New Folder', slug: 'new-folder', createdAt: new Date() };
      
      const mockContext = {
        prisma: {
          collection: {
            create: mock(async () => mockCollection),
          }
        }
      } as unknown as GraphQLContext;

      const result = await collectionResolvers.Mutation.createCollection({}, { name: 'New Folder', slug: 'new-folder' }, mockContext);
      
      expect(mockContext.prisma.collection.create).toHaveBeenCalledWith({
        data: { name: 'New Folder', slug: 'new-folder' }
      });
      expect(result).toEqual(mockCollection);
    });

    it('throws BAD_USER_INPUT when slug already exists', async () => {
      const mockContext = {
        prisma: {
          collection: {
            create: mock(async () => {
              const error = new Error('Prisma error') as any;
              error.code = 'P2002'; // Unique constraint failed
              throw error;
            }),
          }
        }
      } as unknown as GraphQLContext;

      // Wrap in try-catch to assert on the GraphQLError
      try {
        await collectionResolvers.Mutation.createCollection({}, { name: 'New Folder', slug: 'existing' }, mockContext);
        expect(true).toBe(false); // Should not reach here
      } catch (err: any) {
        expect(err.extensions.code).toBe('BAD_USER_INPUT');
        expect(err.message).toContain("already exists");
      }
    });
  });
});
