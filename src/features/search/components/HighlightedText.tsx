/**
 * Component for highlighting matching text in search results
 */
import React from 'react';

export interface HighlightedTextProps {
  text: string;
  query: string;
  highlightClassName?: string;
}

/**
 * Highlights matching text within a string
 * 
 * @param text - The full text to display
 * @param query - The query string to highlight
 * @param highlightClassName - Optional CSS class for highlighted text
 * @returns React element with highlighted matches
 * 
 * @example
 * <HighlightedText text="Hello World" query="world" />
 */
export function HighlightedText({ 
  text, 
  query, 
  highlightClassName = 'bg-yellow-200 text-yellow-900 rounded px-0.5' 
}: HighlightedTextProps): React.ReactElement {
  if (!query.trim()) return <span>{text}</span>;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return <span>{text}</span>;
  
  return (
    <span>
      {text.slice(0, index)}
      <mark className={highlightClassName}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </span>
  );
}
