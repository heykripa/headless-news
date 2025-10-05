import { decode } from "he";

/**
 * Decodes HTML entities in a string using the 'he' library
 */
export function decodeHtmlEntities(text: string): string {
  return decode(text);
}

/**
 * Cleans HTML content by removing tags and decoding entities
 */
export function cleanHtmlContent(html: string): string {
  // First decode HTML entities
  const decoded = decodeHtmlEntities(html);

  // Then strip HTML tags
  const withoutTags = decoded.replace(/<[^>]*>/g, "");

  // Clean up extra whitespace
  return withoutTags.replace(/\s+/g, " ").trim();
}

/**
 * Processes WordPress content for display
 */
export function processWordPressContent(content: string): string {
  return cleanHtmlContent(content);
}
