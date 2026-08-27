import { badInput } from '../errors/errors.js';

export function validateTitle(title: string | null | undefined): void {
  if (title === null || title === undefined) return;
  if (title.trim().length === 0) {
    throw badInput('Title cannot be empty.');
  }
}

export function validateContent(content: string | null | undefined): void {
  if (content === null || content === undefined) return;
  if (content.trim().length === 0) {
    throw badInput('Content cannot be empty.');
  }
}

export function validateSlug(slug: string | null | undefined): void {
  if (slug === null || slug === undefined) return;
  
  // Regex: lowercase letters, numbers, hyphens only. No leading/trailing hyphens.
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    throw badInput('Slug is malformed. Use only lowercase letters, numbers, and hyphens.');
  }
}
