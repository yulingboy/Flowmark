# Implementation Plan: Settings Panel and Search Enhancement

## Overview

实现设置面板和搜索增强功能，采用自底向上的方式：先实现存储层，再实现状态管理，最后实现 UI 组件。

## Tasks

- [x] 1. Implement Settings Storage Module
  - [x] 1.1 Create settingsStorage utility with save/load functions
    - Create `src/utils/settingsStorage.ts`
    - Implement `saveSettings()`, `loadSettings()`, `isStorageAvailable()`
    - Define `STORAGE_KEY` and `StoredSettings` interface
    - Handle JSON serialization/deserialization
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [ ]* 1.2 Write property test for settings round-trip persistence
    - **Property 1: Settings Round-Trip Persistence**
    - **Validates: Requirements 2.5, 3.4, 4.6, 5.2, 5.4, 5.5**

  - [x] 1.3 Implement search history helper functions
    - Create `addToHistory()` function with deduplication
    - Implement max length enforcement (10 items)
    - _Requirements: 4.1, 4.4_

  - [ ]* 1.4 Write property tests for search history
    - **Property 5: Search History Maximum Length Invariant**
    - **Property 6: Search History Deduplication**
    - **Validates: Requirements 4.1, 4.4**

- [x] 2. Implement Settings Context
  - [x] 2.1 Create SettingsContext and SettingsProvider
    - Create `src/contexts/SettingsContext.tsx`
    - Define `Settings` interface and `SettingsContextValue`
    - Implement `SettingsProvider` with localStorage integration
    - Provide `updateBackgroundUrl`, `updateSearchEngine`, `addSearchHistory`, `clearSearchHistory`
    - _Requirements: 2.1, 3.2, 4.1, 5.1, 5.3_

  - [ ]* 2.2 Write property tests for context state management
    - **Property 2: Background URL Storage**
    - **Property 3: Search Engine Selection Storage**
    - **Property 4: Search History Addition**
    - **Validates: Requirements 2.1, 3.2, 4.1**

- [x] 3. Checkpoint - Ensure storage and context tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Settings Panel UI
  - [x] 4.1 Create SettingsButton component
    - Create `src/components/Settings/SettingsButton.tsx`
    - Implement gear icon button with hover effects
    - Position in top-right corner of the app
    - _Requirements: 1.1_

  - [x] 4.2 Create SettingsPanel component
    - Create `src/components/Settings/SettingsPanel.tsx`
    - Implement modal overlay with backdrop
    - Add close button and click-outside-to-close
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.3 Implement background settings section
    - Add URL input field with preview
    - Implement URL validation and error display
    - Connect to SettingsContext
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 4.4 Implement search engine settings section
    - Add radio buttons for Bing, Google, Baidu
    - Display engine icons
    - Connect to SettingsContext
    - _Requirements: 3.1, 3.2_

  - [x] 4.5 Create Settings barrel export
    - Create `src/components/Settings/index.ts`
    - Export SettingsButton and SettingsPanel

- [x] 5. Update Search Component
  - [x] 5.1 Integrate Search with SettingsContext
    - Remove `searchEngine` prop, use context instead
    - Add search history recording on search
    - _Requirements: 3.3, 3.5, 4.1_

  - [x] 5.2 Implement search history dropdown
    - Show history on input focus
    - Allow clicking history items to populate input
    - Add clear history button
    - _Requirements: 4.2, 4.3, 4.5_

- [x] 6. Update App Component
  - [x] 6.1 Integrate SettingsProvider and components
    - Wrap App with SettingsProvider
    - Add SettingsButton to layout
    - Update Background to use context
    - Update Search to use context
    - _Requirements: 2.2, 2.5, 3.3, 3.4, 4.6_

- [x] 7. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests
- Each task references specific requirements for traceability
- Use `fast-check` for property-based testing
- Follow existing project patterns for component structure
