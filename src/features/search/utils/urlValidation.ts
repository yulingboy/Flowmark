/**
 * URL validation and detection utilities
 */

/**
 * URL pattern for detecting valid URLs
 * - Supports optional http:// or https:// protocol
 * - Requires domain name with at least 2-character TLD
 * - Supports optional path
 */
const URL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

/**
 * Checks if a string is a valid URL
 * 
 * @param input - The string to validate
 * @returns true if the input matches URL pattern, false otherwise
 * 
 * @example
 * isValidUrl('example.com') // true
 * isValidUrl('https://example.com/path') // true
 * isValidUrl('not a url') // false
 */
export function isValidUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  return URL_PATTERN.test(trimmed);
}

/**
 * Normalizes a URL by adding https:// protocol if missing
 * 
 * @param url - The URL to normalize
 * @returns The normalized URL with protocol
 * 
 * @example
 * normalizeUrl('example.com') // 'https://example.com'
 * normalizeUrl('http://example.com') // 'http://example.com'
 * normalizeUrl('https://example.com') // 'https://example.com'
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  
  // If already has protocol, return as-is
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Add https:// protocol
  return `https://${trimmed}`;
}
