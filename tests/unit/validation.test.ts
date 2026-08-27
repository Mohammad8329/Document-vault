import { describe, it, expect } from 'bun:test';
import { validateTitle, validateContent, validateSlug } from '../../src/validation/rules.js';

describe('Validation Rules', () => {
  describe('validateTitle', () => {
    it('passes for valid title', () => {
      expect(() => validateTitle('My Document')).not.toThrow();
    });

    it('passes when title is undefined (for partial updates)', () => {
      expect(() => validateTitle(undefined)).not.toThrow();
    });

    it('throws BAD_USER_INPUT for empty string', () => {
      expect(() => validateTitle('')).toThrow('Title cannot be empty.');
    });

    it('throws BAD_USER_INPUT for whitespace string', () => {
      expect(() => validateTitle('   ')).toThrow('Title cannot be empty.');
    });
  });

  describe('validateContent', () => {
    it('passes for valid content', () => {
      expect(() => validateContent('Some valid content here.')).not.toThrow();
    });

    it('throws BAD_USER_INPUT for empty string', () => {
      expect(() => validateContent('')).toThrow('Content cannot be empty.');
    });
  });

  describe('validateSlug', () => {
    it('passes for a valid slug', () => {
      expect(() => validateSlug('my-valid-slug-123')).not.toThrow();
      expect(() => validateSlug('slug')).not.toThrow();
    });

    it('throws BAD_USER_INPUT for uppercase letters', () => {
      expect(() => validateSlug('My-Slug')).toThrow('Slug is malformed');
    });

    it('throws BAD_USER_INPUT for spaces', () => {
      expect(() => validateSlug('my slug')).toThrow('Slug is malformed');
    });

    it('throws BAD_USER_INPUT for leading/trailing hyphens', () => {
      expect(() => validateSlug('-slug')).toThrow('Slug is malformed');
      expect(() => validateSlug('slug-')).toThrow('Slug is malformed');
    });
  });
});
