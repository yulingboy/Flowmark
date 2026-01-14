/**
 * URL 验证和检测工具
 */

/**
 * URL 模式检测正则
 * - 支持可选的 http:// 或 https:// 协议
 * - 要求域名至少有 2 个字符的顶级域名
 * - 支持可选的路径
 */
const URL_PATTERN = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i;

/**
 * 检查字符串是否为有效 URL
 * 
 * @param input - 要验证的字符串
 * @returns 如果输入匹配 URL 模式则返回 true，否则返回 false
 * 
 * @example
 * isValidUrl('example.com') // true
 * isValidUrl('https://example.com/path') // true
 * isValidUrl('not a url') // false
 */
export function isValidUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;
  return URL_PATTERN.test(trimmed);
}

/**
 * 规范化 URL，如果缺少协议则添加 https://
 * 
 * @param url - 要规范化的 URL
 * @returns 带协议的规范化 URL
 * 
 * @example
 * normalizeUrl('example.com') // 'https://example.com'
 * normalizeUrl('http://example.com') // 'http://example.com'
 * normalizeUrl('https://example.com') // 'https://example.com'
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  
  // 如果已有协议，直接返回
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // 添加 https:// 协议
  return `https://${trimmed}`;
}
