/**
 * 图标服务 - 简化版
 * 支持多源回退、占位符生成
 */

const DEFAULT_SIZE = 64;

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^(https?:\/\/)?/, '').split('/')[0];
  }
}

export function generatePlaceholder(name: string, size: number = DEFAULT_SIZE): string {
  const letter = (name || '?')[0].toUpperCase();
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="${bgColor}"/>
    <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="system-ui, sans-serif" font-weight="600" font-size="${size * 0.5}">${letter}</text>
  </svg>`;
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getFaviconUrl(url: string, size: number = DEFAULT_SIZE): string {
  const domain = extractDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

async function validateImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width > 0 && img.height > 0);
    img.onerror = () => resolve(false);
    img.src = url;
    setTimeout(() => resolve(false), 5000);
  });
}

export async function getFaviconUrlAsync(url: string, size: number = DEFAULT_SIZE): Promise<string> {
  const domain = extractDomain(url);
  
  const sources = [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://${domain}/favicon.ico`,
  ];
  
  for (const source of sources) {
    try {
      if (await validateImageUrl(source)) return source;
    } catch { /* continue */ }
  }
  
  return generatePlaceholder(domain, size);
}

export async function preloadFavicons(urls: string[], size: number = DEFAULT_SIZE): Promise<void> {
  await Promise.allSettled(urls.map(url => getFaviconUrlAsync(url, size)));
}

// 保留空实现以兼容现有导出
export function clearFaviconCache(): void {}
export function getCacheStats(): { size: number; maxSize: number } {
  return { size: 0, maxSize: 0 };
}
