/**
 * Input sanitization and validation utilities
 */

/**
 * Maximum allowed input length
 */
const MAX_INPUT_LENGTH = 1000;

/**
 * Escapes HTML entities to prevent XSS attacks
 * 
 * @param input - The string to escape
 * @returns The escaped string with HTML entities replaced
 * 
 * @example
 * escapeHtml('<script>alert("xss")</script>') // '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
export function escapeHtml(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes input by escaping HTML tags and entities
 * 
 * @param input - The string to sanitize
 * @returns The sanitized string safe for display
 * 
 * @example
 * sanitizeInput('<img src=x onerror=alert(1)>') // '&lt;img src=x onerror=alert(1)&gt;'
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;
  return escapeHtml(input);
}

/**
 * Truncates input to maximum allowed length
 * 
 * @param input - The string to truncate
 * @param maxLength - Maximum length (default: 1000)
 * @returns The truncated string
 * 
 * @example
 * truncateInput('a'.repeat(1500)) // Returns string of length 1000
 */
export function truncateInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (!input || input.length <= maxLength) return input;
  return input.slice(0, maxLength);
}

/**
 * Normalizes whitespace by trimming leading and trailing spaces
 * 
 * @param input - The string to normalize
 * @returns The trimmed string
 * 
 * @example
 * normalizeWhitespace('  hello  ') // 'hello'
 * normalizeWhitespace('   ') // ''
 */
export function normalizeWhitespace(input: string): string {
  return input.trim();
}

/**
 * Validates and sanitizes input for safe use
 * Combines normalization, truncation, and sanitization
 * 
 * @param input - The string to validate and sanitize
 * @returns The validated and sanitized string
 * 
 * @example
 * validateAndSanitize('  <script>alert(1)</script>  ') 
 * // '&lt;script&gt;alert(1)&lt;/script&gt;'
 */
export function validateAndSanitize(input: string): string {
  if (!input) return '';
  
  // Normalize whitespace
  let processed = normalizeWhitespace(input);
  
  // Truncate if too long
  processed = truncateInput(processed);
  
  // Sanitize HTML
  processed = sanitizeInput(processed);
  
  return processed;
}
