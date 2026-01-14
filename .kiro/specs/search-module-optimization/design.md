# Design Document: Search Module Optimization

## Overview

This design document outlines the optimization strategy for the search module in the AI Nav application. The optimization focuses on improving performance through memoization and virtualization, enhancing code maintainability through better separation of concerns, and adding intelligent features like improved keyboard navigation and accessibility support.

The design maintains backward compatibility with existing functionality while introducing performance improvements and code quality enhancements. The implementation will be incremental, allowing for testing and validation at each step.

## Architecture

### Current Architecture

The search module currently follows a feature-based structure:

```
src/features/search/
├── components/
│   └── Search.tsx          # Main search component (300+ lines)
├── store/
│   ├── store.ts            # Zustand store with persistence
│   └── types.ts            # Store type definitions
├── utils/
│   ├── search.ts           # Search engine utilities
│   └── searchHistory.ts    # History management utilities
└── index.ts                # Public exports
```

### Proposed Architecture

The optimized architecture separates concerns more clearly:

```
src/features/search/
├── components/
│   ├── Search.tsx                    # Main component (simplified)
│   ├── SearchInput.tsx               # Input field component
│   ├── SearchHistoryDropdown.tsx    # History dropdown component
│   └── HighlightedText.tsx           # Text highlighting component
├── hooks/
│   ├── useSearchInput.ts             # Input state and handlers
│   ├── useSearchHistory.ts           # History filtering and selection
│   ├── useKeyboardNavigation.ts      # Keyboard event handling
│   └── useUrlDetection.ts            # URL pattern detection
├── store/
│   ├── store.ts                      # Zustand store
│   ├── types.ts                      # Type definitions
│   └── selectors.ts                  # Memoized selectors
├── utils/
│   ├── search.ts                     # Search engine utilities
│   ├── searchHistory.ts              # History management
│   ├── urlValidation.ts              # URL pattern validation
│   └── sanitization.ts               # Input sanitization
└── index.ts                          # Public exports
```

### Key Architectural Changes

1. **Component Decomposition**: Split the monolithic Search component into smaller, focused components
2. **Custom Hooks**: Extract complex logic into reusable hooks for better testability
3. **Memoized Selectors**: Add selector functions to prevent unnecessary re-renders
4. **Utility Separation**: Separate validation, sanitization, and URL detection logic

## Components and Interfaces

### Component Hierarchy

```
Search (Container)
├── SearchInput
│   ├── SearchEngineIcon
│   ├── Input (native)
│   ├── UrlIndicator (conditional)
│   └── SearchButton
└── SearchHistoryDropdown (conditional)
    ├── HistoryHeader
    │   ├── Title
    │   └── ClearButton
    └── HistoryList
        └── HistoryItem[] (virtualized if > 20 items)
            ├── ClockIcon
            ├── HighlightedText
            └── RemoveButton
```

### Component Interfaces

#### Search Component

```typescript
interface SearchProps {
  placeholder?: string;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  debounceMs?: number;
  maxHistoryDisplay?: number;
}
```

#### SearchInput Component

```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus: () => void;
  onBlur: () => void;
  placeholder: string;
  searchEngine: SearchEngine;
  isUrl: boolean;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}
```

#### SearchHistoryDropdown Component

```typescript
interface SearchHistoryDropdownProps {
  items: string[];
  query: string;
  selectedIndex: number;
  onSelect: (item: string) => void;
  onRemove: (item: string) => void;
  onClearAll: () => void;
  maxDisplay?: number;
}
```

#### HighlightedText Component

```typescript
interface HighlightedTextProps {
  text: string;
  query: string;
  highlightClassName?: string;
}
```

### Custom Hooks

#### useSearchInput

Manages search input state and basic handlers.

```typescript
interface UseSearchInputReturn {
  query: string;
  setQuery: (value: string) => void;
  debouncedQuery: string;
  isUrl: boolean;
  isFocused: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleSearch: () => void;
}

function useSearchInput(
  debounceMs: number,
  inputRef: React.RefObject<HTMLInputElement>
): UseSearchInputReturn;
```

#### useSearchHistory

Manages search history filtering, selection, and actions.

```typescript
interface UseSearchHistoryReturn {
  filteredHistory: string[];
  selectedIndex: number;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  handleSelectHistory: (item: string) => void;
  handleRemoveHistoryItem: (item: string) => void;
  closeHistory: () => void;
}

function useSearchHistory(
  query: string,
  debouncedQuery: string,
  setQuery: (value: string) => void,
  inputRef: React.RefObject<HTMLInputElement>
): UseSearchHistoryReturn;
```

#### useKeyboardNavigation

Handles keyboard navigation through search history.

```typescript
interface UseKeyboardNavigationReturn {
  selectedIndex: number;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function useKeyboardNavigation(
  filteredHistory: string[],
  onSelect: (item: string) => void,
  onSearch: () => void,
  onClose: () => void
): UseKeyboardNavigationReturn;
```

#### useUrlDetection

Detects if input is a URL and provides validation.

```typescript
interface UseUrlDetectionReturn {
  isUrl: boolean;
  normalizeUrl: (url: string) => string;
}

function useUrlDetection(query: string): UseUrlDetectionReturn;
```

## Data Models

### Search State (Zustand Store)

```typescript
interface SearchState {
  // Configuration
  searchEngine: SearchEngine;
  searchInNewTab: boolean;
  autoFocusSearch: boolean;
  showSearchSuggestions: boolean;
  searchHistoryEnabled: boolean;
  
  // Data
  searchHistory: string[];
  
  // Actions
  updateSearchEngine: (engine: SearchEngine) => void;
  updateSearchInNewTab: (value: boolean) => void;
  updateAutoFocusSearch: (value: boolean) => void;
  updateShowSearchSuggestions: (value: boolean) => void;
  updateSearchHistoryEnabled: (value: boolean) => void;
  addSearchHistory: (query: string) => void;
  removeSearchHistoryItem: (query: string) => void;
  clearSearchHistory: () => void;
  resetSearch: () => void;
}
```

### Search Engine Configuration

```typescript
type SearchEngine = 'bing' | 'google' | 'baidu';

interface SearchEngineConfig {
  name: string;
  urlTemplate: string;
  faviconUrl: string;
  suggestionsEndpoint?: string;
}

const SEARCH_ENGINE_CONFIGS: Record<SearchEngine, SearchEngineConfig>;
```

### Search History Item

```typescript
interface SearchHistoryItem {
  query: string;
  timestamp: number;
  matchScore?: number; // For sorting by relevance
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Debounce Configuration

*For any* debounce delay configuration value, the actual debounce delay applied to user input should equal the configured value (or default to 300ms if not specified).

**Validates: Requirements 1.4**

### Property 2: URL Exclusion from History

*For any* search query that matches the URL pattern, performing a search should not add that query to the search history.

**Validates: Requirements 2.1, 3.4**

### Property 3: History Deduplication

*For any* search history array and any query string, adding a query that already exists in the history should move that query to index 0 and remove the duplicate, maintaining all other items in their relative order.

**Validates: Requirements 2.2**

### Property 4: History Size Limit

*For any* search history array, after adding any number of new queries, the resulting history length should never exceed the configured maximum limit (default 10 items).

**Validates: Requirements 2.3**

### Property 5: History Item Removal

*For any* search history array and any item within it, removing that specific item should result in a history array that does not contain the removed item but contains all other items in their original order.

**Validates: Requirements 2.4**

### Property 6: History Disabled State

*For any* search operation when searchHistoryEnabled is false, the search history array should remain unchanged regardless of searches performed.

**Validates: Requirements 2.5**

### Property 7: URL Pattern Detection

*For any* string containing a valid domain structure with at least a 2-character TLD, the URL detection function should identify it as a URL.

**Validates: Requirements 3.1, 3.5**

### Property 8: URL Navigation Behavior

*For any* detected URL, pressing Enter should trigger direct navigation to that URL rather than performing a search engine query.

**Validates: Requirements 3.2**

### Property 9: URL Protocol Normalization

*For any* URL string lacking a protocol prefix (http:// or https://), the normalized URL should have "https://" prepended to it.

**Validates: Requirements 3.3**

### Property 10: Keyboard Navigation State Transitions

*For any* valid selection index in the range [-1, historyLength-1], pressing ArrowDown should increment the index by 1 (capped at historyLength-1), and pressing ArrowUp should decrement the index by 1 (capped at -1).

**Validates: Requirements 4.1, 4.2**

### Property 11: History Selection Populates Input

*For any* selected history item at a valid index, pressing Enter should set the search input value to match that history item's text.

**Validates: Requirements 4.5**

### Property 12: Dropdown Closure Invariant

*For any* state where the history dropdown is closed (showHistory = false), the selection index should always be -1.

**Validates: Requirements 4.7**

### Property 13: Search URL Encoding

*For any* query string containing special characters (spaces, &, =, ?, etc.), the generated search URL should have all special characters properly percent-encoded according to RFC 3986.

**Validates: Requirements 6.1**

### Property 14: Search Engine Favicon Mapping

*For any* valid search engine selection, the displayed favicon URL should correspond to the correct search engine's favicon configuration.

**Validates: Requirements 6.2**

### Property 15: New Tab Preference Respected

*For any* search operation, the navigation target (same tab vs new tab) should match the user's searchInNewTab preference setting.

**Validates: Requirements 6.5**

### Property 16: Whitespace Input Normalization

*For any* input string composed entirely of whitespace characters (spaces, tabs, newlines), the trimmed result should be an empty string.

**Validates: Requirements 7.1**

### Property 17: Empty Input Validation

*For any* empty or whitespace-only input, submitting the search should not perform a search operation and should not modify the search history.

**Validates: Requirements 7.2**

### Property 18: Input Length Truncation

*For any* input string exceeding 1000 characters, the processed query should be truncated to exactly 1000 characters.

**Validates: Requirements 7.3**

### Property 19: XSS Prevention through Sanitization

*For any* query string containing HTML tags, script tags, or HTML entities, both the stored history version and the displayed version should have those elements properly escaped or removed to prevent XSS attacks.

**Validates: Requirements 7.4, 7.5**

### Property 20: ARIA Active Descendant Sync

*For any* selected history item index, the ARIA-activedescendant attribute should reference the DOM ID of the element at that index.

**Validates: Requirements 8.3**

## Error Handling

### Error Handling Strategy

The search module implements a defensive programming approach with graceful degradation:

1. **Storage Failures**: Wrap localStorage operations in try-catch blocks, falling back to in-memory state
2. **Invalid Input**: Validate and sanitize all user input before processing
3. **Network Failures**: Handle favicon and suggestion API failures without blocking the UI
4. **Configuration Errors**: Validate search engine configurations and fall back to defaults

### Error Scenarios and Responses

| Error Scenario | Detection | Response | User Impact |
|---------------|-----------|----------|-------------|
| localStorage unavailable | Try-catch on read/write | Use in-memory state only | History not persisted across sessions |
| History load failure | Try-catch on parse | Use empty array | Start with clean history |
| Malformed search engine URL | URL validation | Use default engine (Bing) | Search still works with fallback |
| Favicon load failure | Image onerror event | Show fallback icon | Visual degradation only |
| Invalid URL pattern | Regex validation | Treat as search query | Search proceeds normally |
| XSS attempt in input | Sanitization check | Escape/remove malicious content | Safe rendering |

### Error Logging

All errors should be logged to the console with appropriate context:

```typescript
console.error('[Search Module]', errorType, errorDetails);
```

Error types:
- `STORAGE_ERROR`: localStorage access failures
- `VALIDATION_ERROR`: Input validation failures
- `CONFIG_ERROR`: Search engine configuration issues
- `NETWORK_ERROR`: Favicon or API request failures

## Testing Strategy

### Dual Testing Approach

The search module optimization will use both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Framework**: We will use **fast-check** (for TypeScript/JavaScript) as the property-based testing library.

**Configuration**:
- Each property test must run a minimum of 100 iterations
- Each test must be tagged with a comment referencing the design property
- Tag format: `// Feature: search-module-optimization, Property {number}: {property_text}`

**Property Test Examples**:

```typescript
import fc from 'fast-check';

// Feature: search-module-optimization, Property 3: History Deduplication
test('adding duplicate query moves it to top', () => {
  fc.assert(
    fc.property(
      fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
      fc.integer({ min: 0, max: 9 }),
      (history, index) => {
        const existingQuery = history[index];
        const result = addToHistory(history, existingQuery);
        
        // Should be at index 0
        expect(result[0]).toBe(existingQuery);
        // Should not have duplicates
        expect(result.filter(q => q === existingQuery).length).toBe(1);
        // Should maintain other items
        expect(result.length).toBeLessThanOrEqual(history.length);
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: search-module-optimization, Property 9: URL Protocol Normalization
test('URLs without protocol get https:// prepended', () => {
  fc.assert(
    fc.property(
      fc.domain(),
      (domain) => {
        const normalized = normalizeUrl(domain);
        expect(normalized).toMatch(/^https:\/\//);
        expect(normalized).toContain(domain);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Framework**: Vitest (already configured in the project)

**Test Coverage Areas**:

1. **Utility Functions**:
   - `addToHistory()` - deduplication, size limits
   - `removeFromHistory()` - item removal
   - `generateSearchUrl()` - URL encoding
   - `normalizeUrl()` - protocol handling
   - `sanitizeInput()` - XSS prevention
   - `isValidUrl()` - URL pattern matching

2. **Custom Hooks**:
   - `useSearchInput` - input state management
   - `useSearchHistory` - history filtering
   - `useKeyboardNavigation` - keyboard events
   - `useUrlDetection` - URL detection logic

3. **Edge Cases**:
   - Empty input handling
   - Whitespace-only input
   - Maximum length input (>1000 chars)
   - Special characters in queries
   - Malformed URLs
   - Empty history array
   - History at maximum capacity

4. **Error Conditions**:
   - localStorage unavailable
   - Invalid search engine configuration
   - Malformed history data
   - XSS attempts

### Test File Organization

```
src/features/search/
├── utils/
│   ├── __tests__/
│   │   ├── search.test.ts
│   │   ├── searchHistory.test.ts
│   │   ├── urlValidation.test.ts
│   │   └── sanitization.test.ts
├── hooks/
│   ├── __tests__/
│   │   ├── useSearchInput.test.ts
│   │   ├── useSearchHistory.test.ts
│   │   ├── useKeyboardNavigation.test.ts
│   │   └── useUrlDetection.test.ts
└── components/
    └── __tests__/
        ├── Search.test.tsx
        ├── SearchInput.test.tsx
        └── SearchHistoryDropdown.test.tsx
```

### Integration Testing

While not part of the core unit/property testing strategy, integration tests should verify:

1. Complete search flow from input to navigation
2. History persistence across component remounts
3. Keyboard navigation through full interaction cycle
4. Settings changes affecting search behavior

These can be implemented using React Testing Library with user event simulation.

### Test Execution

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run only property-based tests
pnpm test -- --grep "Property"
```

### Success Criteria

- All property tests pass with 100+ iterations
- Unit test coverage > 90% for utility functions
- Unit test coverage > 80% for hooks
- All edge cases have explicit test coverage
- All error conditions have test coverage
