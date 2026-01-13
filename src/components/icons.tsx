/**
 * 自定义 SVG 图标
 * 通用图标请直接从 @ant-design/icons 导入
 */

export const WallpaperIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
  </svg>
);

export const OpenTabIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const LayoutIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const UnfoldIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

export const EmptyFolderIcon = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

/** 新标签页打开角标 */
export const OpenModeIndicator = ({ size = 'normal' }: { size?: 'small' | 'normal' }) => {
  const isSmall = size === 'small';
  return (
    <div className={`absolute bottom-0 right-0 ${isSmall ? 'w-5 h-5 rounded-tl-xl' : 'w-6 h-6 rounded-tl-2xl'} bg-[#0084FF] flex items-center justify-center`}>
      <svg fill="none" width={isSmall ? 12 : 14} height={isSmall ? 12 : 14} viewBox="0 0 32 32">
        <rect x="7" y="6" width="19" height="19" fill="#FFF" />
        <path d="M16,0C7.16,0,0,7.16,0,16s7.16,16,16,16,16-7.16,16-16S24.84,0,16,0Zm8.02,14.38c-.62,1-1.6,1.73-2.73,2.05-.25.08-.5.12-.76.13-.5,0-.9-.41-.9-.91s.4-.91.9-.91c.07,0,.14-.01.2-.04.73-.18,1.36-.64,1.75-1.28.23-.37.35-.8.35-1.24,0-1.44-1.33-2.62-2.95-2.62-.56,0-1.11.14-1.6.42-.82.43-1.34,1.27-1.37,2.2v7.63c-.02,1.57-.89,3.02-2.27,3.76-.76.43-1.62.65-2.49.64-2.64,0-4.8-1.98-4.8-4.44,0-.77.21-1.52.61-2.18.62-1,1.6-1.73,2.73-2.05.25-.08.5-.12.76-.13.5,0,.91.41.91.91s-.41.91-.91.91c-.07,0-.14.01-.2.04-.73.19-1.36.65-1.75,1.28-.23.37-.35.8-.35,1.24,0,1.44,1.33,2.62,2.97,2.62.56,0,1.11-.14,1.6-.42.82-.43,1.34-1.27,1.37-2.2v-7.6c.02-1.58.89-3.02,2.28-3.77.75-.45,1.6-.68,2.47-.67,2.64,0,4.8,1.98,4.8,4.44,0,.77-.21,1.52-.62,2.18Z" fill="#0084FF" />
      </svg>
    </div>
  );
};
