// 常见网站信息预设
export const SITE_INFO: Record<string, { name: string; description: string }> = {
  'baidu.com': { name: '百度', description: '全球领先的中文搜索引擎' },
  'google.com': { name: 'Google', description: '全球最大的搜索引擎' },
  'github.com': { name: 'GitHub', description: '全球最大的代码托管平台' },
  'bilibili.com': { name: '哔哩哔哩', description: '国内知名的视频弹幕网站' },
  'zhihu.com': { name: '知乎', description: '中文互联网高质量问答社区' },
  'weibo.com': { name: '微博', description: '随时随地发现新鲜事' },
  'taobao.com': { name: '淘宝', description: '淘你喜欢' },
  'jd.com': { name: '京东', description: '多快好省，只为品质生活' },
  'douyin.com': { name: '抖音', description: '记录美好生活' },
  'iqiyi.com': { name: '爱奇艺', description: '在线视频网站' },
  'youku.com': { name: '优酷', description: '这世界很酷' },
  'mgtv.com': { name: '芒果TV', description: '湖南卫视在线视频' },
  'qq.com': { name: '腾讯网', description: '中国浏览量最大的中文门户网站' },
  '163.com': { name: '网易', description: '网聚人的力量' },
  'sina.com.cn': { name: '新浪', description: '新浪网' },
  'sohu.com': { name: '搜狐', description: '搜狐网' },
  'csdn.net': { name: 'CSDN', description: '中国开发者社区' },
  'juejin.cn': { name: '掘金', description: '一个帮助开发者成长的社区' },
  'npmjs.com': { name: 'NPM', description: 'JavaScript 包管理器' },
  'stackoverflow.com': { name: 'Stack Overflow', description: '程序员问答社区' },
  'wikipedia.org': { name: '维基百科', description: '自由的百科全书' },
  'youtube.com': { name: 'YouTube', description: '全球最大的视频分享网站' },
  'twitter.com': { name: 'Twitter', description: '社交媒体平台' },
  'facebook.com': { name: 'Facebook', description: '社交网络服务网站' },
  'instagram.com': { name: 'Instagram', description: '图片和视频分享社交平台' },
  'linkedin.com': { name: 'LinkedIn', description: '职业社交网站' },
  'reddit.com': { name: 'Reddit', description: '社交新闻聚合网站' },
  'amazon.com': { name: 'Amazon', description: '全球最大的电子商务公司' },
  'apple.com': { name: 'Apple', description: '苹果公司官网' },
  'microsoft.com': { name: 'Microsoft', description: '微软公司官网' },
  'gitlab.com': { name: 'GitLab', description: '代码托管和CI/CD平台' },
  'notion.so': { name: 'Notion', description: '一体化工作空间' },
  'figma.com': { name: 'Figma', description: '协作设计工具' },
  'dribbble.com': { name: 'Dribbble', description: '设计师作品展示平台' },
  'behance.net': { name: 'Behance', description: '创意作品展示平台' },
};

// 从 URL 提取网站信息
export function extractSiteInfo(urlString: string): { name: string; description: string } | null {
  try {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    const hostname = url.hostname.replace('www.', '');
    
    for (const [domain, info] of Object.entries(SITE_INFO)) {
      if (hostname.includes(domain)) return info;
    }
    
    const parts = hostname.split('.');
    const siteName = parts[0];
    const capitalizedName = siteName.charAt(0).toUpperCase() + siteName.slice(1);
    
    return { name: capitalizedName, description: `${capitalizedName} 网站` };
  } catch {
    return null;
  }
}
