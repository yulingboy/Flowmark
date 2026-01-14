/**
 * Custom generators for property-based testing with fast-check
 */
import fc from 'fast-check';

/**
 * Generate valid domain names
 */
export const domain = () =>
  fc
    .tuple(
      fc.stringMatching(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i), // domain name
      fc.stringMatching(/^[a-z]{2,}$/i) // TLD (2+ chars)
    )
    .map(([name, tld]) => `${name}.${tld}`);

/**
 * Generate URLs with optional protocol
 */
export const url = () =>
  fc
    .tuple(
      fc.option(fc.constantFrom('http://', 'https://'), { nil: '' }),
      domain(),
      fc.option(fc.stringMatching(/^\/[a-z0-9/_-]*$/i), { nil: '' })
    )
    .map(([protocol, dom, path]) => `${protocol}${dom}${path}`);

/**
 * Generate search queries (non-URL strings)
 */
export const searchQuery = () =>
  fc.stringMatching(/^[^.]+$/).filter((s) => s.trim().length > 0 && s.trim().length <= 100);

/**
 * Generate whitespace-only strings
 */
export const whitespaceString = () =>
  fc
    .array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 })
    .map((chars) => chars.join(''));

/**
 * Generate strings with HTML/XSS content
 */
export const xssString = () =>
  fc.oneof(
    fc.constant('<script>alert("xss")</script>'),
    fc.constant('<img src=x onerror=alert(1)>'),
    fc.constant('<svg onload=alert(1)>'),
    fc.constant('javascript:alert(1)'),
    fc.constant('<iframe src="javascript:alert(1)">'),
    fc.string().map((s) => `<div>${s}</div>`)
  );

/**
 * Generate valid search history arrays
 */
export const searchHistoryArray = () =>
  fc.array(searchQuery(), { minLength: 0, maxLength: 15 });
