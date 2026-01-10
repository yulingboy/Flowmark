/**
 * 使用 Google Favicon 服务获取网站图标
 * @param url 网站 URL
 * @param size 图标大小 (16, 32, 64, 128, 256)
 * @returns 图标 URL
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    // 如果 URL 解析失败，直接使用输入作为域名
    return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
  }
}

/**
 * 从域名获取图标
 * @param domain 域名
 * @param size 图标大小
 */
export function getFaviconByDomain(domain: string, size: number = 64): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}
