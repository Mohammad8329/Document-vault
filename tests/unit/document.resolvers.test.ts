import { describe, it, expect, mock } from 'bun:test';
import { documentResolvers } from '../../src/resolvers/document.resolvers.js';
import type { GraphQLContext } from '../../src/context.js';

describe('Document Resolvers', () => {
  describe('Mutation.createDocument', () => {
    it('successfully creates a document', async () => {
      const mockDoc = { id: 'd1', title: 'Doc', content: 'Cont', collectionId: 'c1' };
      
      const mockContext = {
        prisma: {
          collection: {
            findUnique: mock(async () => ({ id: 'c1' })), // simulate collection exists
          },
          document: {
            create: mock(async () => mockDoc as any),
          }
        }
      } as unknown as GraphQLContext;

      const result = await documentResolvers.Mutation.createDocument(
        {}, 
        { collectionId: 'c1', title: 'Doc', content: 'Cont' }, 
        mockContext
      );
      
      expect(mockContext.prisma.document.create).toHaveBeenCalled();
      expect(result).toEqual(mockDoc as any);
    });

    it('throws NOT_FOUND if collection does not exist', async () => {
      const mockContext = {
        prisma: {
          collection: {
            findUnique: mock(async () => null), // collection not found
          },
        }
      } as unknown as GraphQLContext;

      try {
        await documentResolvers.Mutation.createDocument(
          {}, 
          { collectionId: 'bad_id', title: 'Doc', content: 'Cont' }, 
          mockContext
        );
        expect(true).toBe(false); // Should not reach here
      } catch (err: any) {
        expect(err.extensions.code).toBe('NOT_FOUND');
      }
    });
  });

  describe('Mutation.deleteDocument', () => {
    it('throws NOT_FOUND if document does not exist (P2025)', async () => {
      const mockContext = {
        prisma: {
          document: {
            delete: mock(async () => {
              const error = new Error('Prisma error') as any;
              error.code = 'P2025'; // Record to delete does not exist
              throw error;
            }),
          }
        }
      } as unknown as GraphQLContext;

      try {
        await documentResolvers.Mutation.deleteDocument({}, { id: 'missing' }, mockContext);
        expect(true).toBe(false); // Should not reach here
      } catch (err: any) {
        expect(err.extensions.code).toBe('NOT_FOUND');
      }
    });
  });
});
