/**
 * 输入清理和验证工具函数
 */

/**
 * 最大允许输入长度
 */
const MAX_INPUT_LENGTH = 1000;

/**
 * 转义 HTML 实体以防止 XSS 攻击
 * 
 * @param input - 要转义的字符串
 * @returns 转义后的字符串，HTML 实体已被替换
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
 * 通过转义 HTML 标签和实体来清理输入
 * 
 * @param input - 要清理的字符串
 * @returns 清理后的安全字符串
 * 
 * @example
 * sanitizeInput('<img src=x onerror=alert(1)>') // '&lt;img src=x onerror=alert(1)&gt;'
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;
  return escapeHtml(input);
}

/**
 * 截断输入到最大允许长度
 * 
 * @param input - 要截断的字符串
 * @param maxLength - 最大长度（默认：1000）
 * @returns 截断后的字符串
 * 
 * @example
 * truncateInput('a'.repeat(1500)) // 返回长度为 1000 的字符串
 */
export function truncateInput(input: string, maxLength: number = MAX_INPUT_LENGTH): string {
  if (!input || input.length <= maxLength) return input;
  return input.slice(0, maxLength);
}

/**
 * 规范化空白字符，去除首尾空格
 * 
 * @param input - 要规范化的字符串
 * @returns 去除空格后的字符串
 * 
 * @example
 * normalizeWhitespace('  hello  ') // 'hello'
 * normalizeWhitespace('   ') // ''
 */
export function normalizeWhitespace(input: string): string {
  return input.trim();
}

/**
 * 验证并清理输入以确保安全使用
 * 组合了规范化、截断和清理功能
 * 
 * @param input - 要验证和清理的字符串
 * @returns 验证并清理后的字符串
 * 
 * @example
 * validateAndSanitize('  <script>alert(1)</script>  ') 
 * // '&lt;script&gt;alert(1)&lt;/script&gt;'
 */
export function validateAndSanitize(input: string): string {
  if (!input) return '';
  
  // 规范化空白字符
  let processed = normalizeWhitespace(input);
  
  // 如果太长则截断
  processed = truncateInput(processed);
  
  // 清理 HTML
  processed = sanitizeInput(processed);
  
  return processed;
}
