# Test Helpers

This directory contains helper utilities for testing, including custom generators for property-based testing.

## Generators

The `generators.ts` file provides custom generators for use with fast-check:

### Available Generators

- `domain()` - Generates valid domain names (e.g., "example.com")
- `url()` - Generates URLs with optional protocol and path
- `searchQuery()` - Generates non-URL search query strings
- `whitespaceString()` - Generates strings containing only whitespace
- `xssString()` - Generates strings with potential XSS content
- `searchHistoryArray()` - Generates arrays of search queries

### Usage Example

```typescript
import fc from 'fast-check';
import { domain, searchQuery } from '@/test/helpers/generators';

test('property test example', () => {
  fc.assert(
    fc.property(searchQuery(), (query) => {
      // Your test logic here
      expect(query.trim()).toBe(query);
    }),
    { numRuns: 100 }
  );
});
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/features/search/utils/__tests__/search.test.ts
```
