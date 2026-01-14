/**
 * 在搜索结果中高亮匹配文本的组件
 */
import React from 'react';

export interface HighlightedTextProps {
  text: string;
  query: string;
  highlightClassName?: string;
}

/**
 * 在字符串中高亮匹配的文本
 * 
 * @param text - 要显示的完整文本
 * @param query - 要高亮的查询字符串
 * @param highlightClassName - 高亮文本的可选 CSS 类名
 * @returns 带有高亮匹配项的 React 元素
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
