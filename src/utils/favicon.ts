/**
 * Favicon 服务配置
 */
const FAVICON_SERVICES = {
  google: (domain: string, size: number) => `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
  duckduckgo: (domain: string) => `https://icons.duckduckgo.com/ip3/${domain}.ico`,
};

/**
 * 使用 Google Favicon 服务获取网站图标（带备用服务）
 * @param url 网站 URL
 * @param size 图标大小 (16, 32, 64, 128, 256)
 * @returns 图标 URL
 */
export function getFaviconUrl(url: string, size: number = 64): string {
  try {
    const domain = new URL(url).hostname;
    return FAVICON_SERVICES.google(domain, size);
  } catch {
    return FAVICON_SERVICES.google(url, size);
  }
}

/**
 * 获取备用 Favicon URL（当主服务失败时使用）
 */
export function getFallbackFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return FAVICON_SERVICES.duckduckgo(domain);
  } catch {
    return FAVICON_SERVICES.duckduckgo(url);
  }
}

/**
 * 从域名获取图标
 * @param domain 域名
 * @param size 图标大小
 */
export function getFaviconByDomain(domain: string, size: number = 64): string {
  return FAVICON_SERVICES.google(domain, size);
}
