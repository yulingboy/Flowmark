/**
 * Tests for SearchEngineSelector component
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchEngineSelector } from '../SearchEngineSelector';

describe('SearchEngineSelector', () => {
  it('should render current search engine', () => {
    const onEngineChange = vi.fn();
    render(
      <SearchEngineSelector 
        currentEngine="google" 
        onEngineChange={onEngineChange} 
      />
    );
    
    const button = screen.getByRole('button', { name: /选择搜索引擎/i });
    expect(button).toBeInTheDocument();
  });

  it('should open dropdown when clicked', () => {
    const onEngineChange = vi.fn();
    render(
      <SearchEngineSelector 
        currentEngine="google" 
        onEngineChange={onEngineChange} 
      />
    );
    
    const button = screen.getByRole('button', { name: /选择搜索引擎/i });
    fireEvent.click(button);
    
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();
  });

  it('should call onEngineChange when engine is selected', () => {
    const onEngineChange = vi.fn();
    render(
      <SearchEngineSelector 
        currentEngine="google" 
        onEngineChange={onEngineChange} 
      />
    );
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /选择搜索引擎/i });
    fireEvent.click(button);
    
    // Select Bing
    const bingOption = screen.getByRole('menuitem', { name: /切换到 Bing/i });
    fireEvent.click(bingOption);
    
    expect(onEngineChange).toHaveBeenCalledWith('bing');
  });

  it('should highlight current engine', () => {
    const onEngineChange = vi.fn();
    render(
      <SearchEngineSelector 
        currentEngine="google" 
        onEngineChange={onEngineChange} 
      />
    );
    
    // Open dropdown
    const button = screen.getByRole('button', { name: /选择搜索引擎/i });
    fireEvent.click(button);
    
    // Google option should have blue background
    const googleOption = screen.getByRole('menuitem', { name: /切换到 Google/i });
    expect(googleOption).toHaveClass('bg-blue-50');
  });
});
