/**
 * 使用 Google Favicon 服务获取网站图标
 * @param url 网站 URL
 * @param size 图标大小 (16, 32, 64, 128, 256)
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return `https://www.google.com/s2/favicons?domain=${url}&sz=${size}`;
  }
}
