# Implementation Plan: Search Module Optimization

## Overview

This implementation plan breaks down the search module optimization into incremental, testable steps. Each task builds on previous work and includes validation through tests. The plan focuses on refactoring for better maintainability, adding property-based tests for correctness, and implementing performance optimizations.

## Tasks

- [x] 1. Set up testing infrastructure and utilities
  - Install fast-check library for property-based testing
  - Create test setup files and helpers
  - Create utility test files structure
  - _Requirements: 5.6, 5.7_

- [x] 2. Implement and test core utility functions
  - [x] 2.1 Create URL validation utility with pattern matching
    - Implement `isValidUrl()` function with regex for domain validation
    - Support TLD validation (minimum 2 characters)
    - _Requirements: 3.5_

  - [ ]* 2.2 Write property test for URL validation
    - **Property 7: URL Pattern Detection**
    - **Validates: Requirements 3.1, 3.5**

  - [x] 2.3 Create URL normalization utility
    - Implement `normalizeUrl()` function to prepend https:// when missing
    - Handle URLs that already have protocols
    - _Requirements: 3.3_

  - [ ]* 2.4 Write property test for URL normalization
    - **Property 9: URL Protocol Normalization**
    - **Validates: Requirements 3.3**

  - [ ]* 2.5 Write unit tests for URL utilities edge cases
    - Test malformed URLs
    - Test URLs with various protocols
    - Test domains with different TLD lengths
    - _Requirements: 3.5_

- [x] 3. Implement input sanitization and validation
  - [x] 3.1 Create input sanitization utility
    - Implement `sanitizeInput()` to escape HTML tags and entities
    - Implement `truncateInput()` to limit length to 1000 characters
    - Implement `normalizeWhitespace()` to trim whitespace
    - _Requirements: 7.1, 7.3, 7.4, 7.5_

  - [ ]* 3.2 Write property test for whitespace normalization
    - **Property 16: Whitespace Input Normalization**
    - **Validates: Requirements 7.1**

  - [ ]* 3.3 Write property test for input truncation
    - **Property 18: Input Length Truncation**
    - **Validates: Requirements 7.3**

  - [ ]* 3.4 Write property test for XSS prevention
    - **Property 19: XSS Prevention through Sanitization**
    - **Validates: Requirements 7.4, 7.5**

  - [ ]* 3.5 Write unit tests for sanitization edge cases
    - Test various XSS attack patterns
    - Test mixed content (text + HTML)
    - Test already-escaped content
    - _Requirements: 7.4, 7.5_

- [x] 4. Enhance search history utilities
  - [x] 4.1 Update `addToHistory()` with URL filtering
    - Add URL detection check before adding to history
    - Maintain existing deduplication logic
    - _Requirements: 2.1, 2.2, 3.4_

  - [ ]* 4.2 Write property test for URL exclusion from history
    - **Property 2: URL Exclusion from History**
    - **Validates: Requirements 2.1, 3.4**

  - [ ]* 4.3 Write property test for history deduplication
    - **Property 3: History Deduplication**
    - **Validates: Requirements 2.2**

  - [ ]* 4.4 Write property test for history size limit
    - **Property 4: History Size Limit**
    - **Validates: Requirements 2.3**

  - [ ]* 4.5 Write property test for history item removal
    - **Property 5: History Item Removal**
    - **Validates: Requirements 2.4**

  - [ ]* 4.6 Write unit tests for history edge cases
    - Test empty history
    - Test history at maximum capacity
    - Test removing non-existent items
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 5. Checkpoint - Ensure all utility tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Create custom hooks for search functionality
  - [x] 6.1 Implement `useUrlDetection` hook
    - Use URL validation utility
    - Return isUrl boolean and normalizeUrl function
    - Memoize results based on query
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 6.2 Implement `useSearchInput` hook
    - Manage query state and debounced query
    - Implement input change, focus, blur handlers
    - Integrate URL detection
    - Implement search execution logic
    - _Requirements: 1.4, 7.1, 7.2_

  - [ ]* 6.3 Write property test for debounce configuration
    - **Property 1: Debounce Configuration**
    - **Validates: Requirements 1.4**

  - [ ]* 6.4 Write property test for empty input validation
    - **Property 17: Empty Input Validation**
    - **Validates: Requirements 7.2**

  - [x] 6.5 Implement `useSearchHistory` hook
    - Manage filtered history with memoization
    - Implement history selection and removal handlers
    - Integrate with store actions
    - _Requirements: 2.4, 2.5, 2.6_

  - [ ]* 6.6 Write property test for history disabled state
    - **Property 6: History Disabled State**
    - **Validates: Requirements 2.5**

  - [x] 6.7 Implement `useKeyboardNavigation` hook
    - Handle ArrowUp, ArrowDown, Enter, Escape keys
    - Manage selection index state
    - Implement boundary conditions
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 6.8 Write property test for keyboard navigation state transitions
    - **Property 10: Keyboard Navigation State Transitions**
    - **Validates: Requirements 4.1, 4.2**

  - [ ]* 6.9 Write property test for history selection populates input
    - **Property 11: History Selection Populates Input**
    - **Validates: Requirements 4.5**

  - [ ]* 6.10 Write property test for dropdown closure invariant
    - **Property 12: Dropdown Closure Invariant**
    - **Validates: Requirements 4.7**

  - [ ]* 6.11 Write unit tests for hooks edge cases
    - Test keyboard navigation boundaries
    - Test focus/blur interactions
    - Test debounce timing
    - _Requirements: 4.3, 4.4, 1.4_

- [x] 7. Checkpoint - Ensure all hook tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Enhance search engine utilities
  - [x] 8.1 Update `generateSearchUrl()` with proper encoding
    - Use encodeURIComponent for query parameters
    - Validate encoding of special characters
    - _Requirements: 6.1_

  - [ ]* 8.2 Write property test for search URL encoding
    - **Property 13: Search URL Encoding**
    - **Validates: Requirements 6.1**

  - [x] 8.3 Create search engine configuration with favicon mapping
    - Define SearchEngineConfig interface
    - Create SEARCH_ENGINE_CONFIGS constant
    - Update SEARCH_ENGINE_ICONS to use config
    - _Requirements: 6.2_

  - [ ]* 8.4 Write property test for favicon mapping
    - **Property 14: Search Engine Favicon Mapping**
    - **Validates: Requirements 6.2**

  - [x] 8.5 Update `performSearch()` to respect new tab preference
    - Use searchInNewTab from store
    - Validate navigation target
    - _Requirements: 6.5_

  - [ ]* 8.6 Write property test for new tab preference
    - **Property 15: New Tab Preference Respected**
    - **Validates: Requirements 6.5**

- [x] 9. Create new component structure
  - [x] 9.1 Extract `HighlightedText` component
    - Move highlighting logic to separate component
    - Add props interface with TypeScript
    - Add configurable highlight className
    - _Requirements: 5.1, 5.3_

  - [x] 9.2 Extract `SearchInput` component
    - Create component with search engine icon, input, URL indicator, search button
    - Use useSearchInput hook
    - Add proper TypeScript interfaces
    - Add ARIA labels for accessibility
    - _Requirements: 5.1, 5.3, 8.1, 8.4_

  - [x] 9.3 Extract `SearchHistoryDropdown` component
    - Create component with header and virtualized list
    - Use useSearchHistory hook
    - Add ARIA attributes for accessibility
    - Implement virtualization for lists > 20 items
    - _Requirements: 1.3, 5.1, 5.3, 8.2, 8.3_

  - [ ]* 9.4 Write property test for ARIA active descendant sync
    - **Property 20: ARIA Active Descendant Sync**
    - **Validates: Requirements 8.3**

  - [ ]* 9.5 Write unit tests for component rendering
    - Test SearchInput renders correctly
    - Test SearchHistoryDropdown renders correctly
    - Test HighlightedText highlighting logic
    - _Requirements: 5.1_

- [x] 10. Refactor main Search component
  - [x] 10.1 Update Search component to use new hooks and components
    - Replace inline logic with custom hooks
    - Use extracted components (SearchInput, SearchHistoryDropdown)
    - Simplify component structure
    - Maintain backward compatibility with existing props
    - _Requirements: 5.1, 5.2_

  - [x] 10.2 Add error handling and logging
    - Wrap localStorage operations in try-catch
    - Add error logging for all error scenarios
    - Implement graceful degradation
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 10.3 Write unit tests for error handling
    - Test localStorage unavailable scenario
    - Test history load failure
    - Test malformed search engine config
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 11. Add store selectors for memoization
  - [x] 11.1 Create selectors.ts with memoized selectors
    - Create selector for filtered history
    - Create selector for search configuration
    - Use proper memoization techniques
    - _Requirements: 1.2_

  - [x] 11.2 Update components to use selectors
    - Replace direct store access with selectors
    - Verify performance improvements
    - _Requirements: 1.2_

- [x] 12. Update store with sanitization
  - [x] 12.1 Add input sanitization to store actions
    - Sanitize queries in addSearchHistory
    - Validate input before storing
    - _Requirements: 7.4_

  - [x] 12.2 Add error handling to store persistence
    - Wrap persist operations in try-catch
    - Handle localStorage errors gracefully
    - _Requirements: 9.1_

- [x] 13. Add JSDoc comments and documentation
  - [x] 13.1 Add JSDoc comments to all utility functions
    - Document parameters, return values, examples
    - Follow JSDoc standards
    - _Requirements: 5.4_

  - [x] 13.2 Add JSDoc comments to all custom hooks
    - Document hook parameters, return values, usage
    - Include examples where helpful
    - _Requirements: 5.4_

  - [x] 13.3 Add JSDoc comments to component props interfaces
    - Document all props with descriptions
    - Include default values where applicable
    - _Requirements: 5.4_

- [x] 14. Final integration and testing
  - [x] 14.1 Integration test for complete search flow
    - Test input → search → history → navigation flow
    - Test keyboard navigation through full cycle
    - Test settings changes affecting behavior
    - _Requirements: All_

  - [x] 14.2 Manual testing checklist
    - Test all search engines
    - Test URL detection and navigation
    - Test history management (add, remove, clear)
    - Test keyboard navigation
    - Test accessibility with screen reader
    - Test error scenarios (localStorage disabled)
    - _Requirements: All_

  - [x] 14.3 Performance validation
    - Verify UI updates within 16ms
    - Verify memoization prevents unnecessary renders
    - Verify virtualization works for large history lists
    - _Requirements: 1.1, 1.2, 1.3_

- [x] 15. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The refactoring maintains backward compatibility with existing functionality
- Error handling is implemented throughout to ensure graceful degradation
