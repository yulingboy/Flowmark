/**
 * 图标库 - 集中管理所有 SVG 图标
 */

export interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

// 辅助函数：生成图标样式
const getIconStyle = (size?: number | string, color?: string) => ({
  width: size ?? undefined,
  height: size ?? undefined,
  color: color ?? undefined,
});

// ==================== 通用图标 ====================

export const AddIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 8v8M8 12h8" />
  </svg>
);

export const FolderIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

export const WallpaperIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
  </svg>
);

export const RefreshIcon = ({ className = 'w-4 h-4', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M23 4v6h-6M1 20v-6h6" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

export const EditIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const SettingsIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

export const DeleteIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

export const CloseIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


export const SearchIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const OpenTabIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const MoveIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

export const LayoutIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

export const ChevronRightIcon = ({ className = 'w-4 h-4', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const CheckIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const UploadIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const LinkIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);

export const InfoIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const WarningIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ErrorIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export const SuccessIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const HomeIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const ClockIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ImageIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export const KeyboardIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
    <line x1="6" y1="8" x2="6.01" y2="8" />
    <line x1="10" y1="8" x2="10.01" y2="8" />
    <line x1="14" y1="8" x2="14.01" y2="8" />
    <line x1="18" y1="8" x2="18.01" y2="8" />
    <line x1="8" y1="12" x2="8.01" y2="12" />
    <line x1="12" y1="12" x2="12.01" y2="12" />
    <line x1="16" y1="12" x2="16.01" y2="12" />
    <line x1="7" y1="16" x2="17" y2="16" />
  </svg>
);


// ==================== 文件夹相关图标 ====================

export const UnfoldIcon = ({ className = 'w-5 h-5', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} style={getIconStyle(size, color)}>
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

export const EmptyFolderIcon = ({ className = 'w-8 h-8', size, color }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={getIconStyle(size, color)}>
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

// ==================== 打开方式角标组件 ====================

/** 新标签页打开角标 - 蓝色 TikTok 风格 */
export const OpenModeIndicator = ({ size = 'normal' }: { size?: 'small' | 'normal' }) => {
  const sizeClass = size === 'small' ? 'w-5 h-5' : 'w-6 h-6';
  const iconSize = size === 'small' ? 12 : 14;
  const roundedClass = size === 'small' ? 'rounded-tl-xl' : 'rounded-tl-2xl';
  
  return (
    <div className={`absolute bottom-0 right-0 ${sizeClass} bg-[#0084FF] ${roundedClass} flex items-center justify-center`}>
      <svg fill="none" version="1.1" width={iconSize} height={iconSize} viewBox="0 0 32 32">
        <g>
          <rect x="7" y="6" width="19" height="19" rx="0" fill="#FFFFFF" fillOpacity="1" />
          <path d="M16,0C7.16344,0,0,7.16344,0,16C0,24.8366,7.16344,32,16,32C24.8366,32,32,24.8366,32,16C32,7.16344,24.8366,0,16,0ZM24.0224,14.3808C23.3989,15.3805,22.426,16.1127,21.2928,16.4352C21.0457,16.5158,20.7879,16.559,20.528,16.5632C20.0282,16.5603,19.6245,16.1542,19.6245,15.6544C19.6245,15.1545,20.0282,14.7485,20.528,14.7456C20.5972,14.7472,20.6659,14.7341,20.7296,14.7072C21.4574,14.5263,22.0849,14.0666,22.4768,13.4272C22.7048,13.0545,22.8244,12.6257,22.8224,12.1888C22.8224,10.752,21.4944,9.568,19.8752,9.568C19.3149,9.56918,18.7641,9.71347,18.2752,9.98719C17.4545,10.4193,16.9318,11.2616,16.9088,12.1888Q16.8858,13.116,16.9088,19.8208C16.8926,21.3952,16.0225,22.8365,14.6368,23.584C13.8762,24.0117,13.0166,24.2324,12.144,24.224C9.50719,24.224,7.344,22.24,7.344,19.7856C7.34867,19.0157,7.56211,18.2614,7.96159,17.6032C8.58511,16.6035,9.55798,15.8713,10.6912,15.5488C10.9386,15.4694,11.1962,15.4262,11.456,15.4208C11.96,15.4179,12.3701,15.8256,12.3701,16.3296C12.3701,16.8336,11.96,17.2414,11.456,17.2384C11.3868,17.2368,11.3181,17.2499,11.2544,17.2768C10.5329,17.4709,9.90979,17.9274,9.50722,18.5568C9.27923,18.9295,9.15955,19.3583,9.1616,19.7952C9.1616,21.232,10.4896,22.416,12.128,22.416C12.6883,22.4148,13.2391,22.2705,13.728,21.9968C14.5474,21.5638,15.0688,20.7217,15.0912,19.7952L15.0912,12.1984C15.1089,10.6228,15.98,9.18083,17.3664,8.43203C18.1133,7.98446,18.9693,7.75191,19.84,7.76003C22.4768,7.76003,24.64,9.74403,24.64,12.1984C24.6353,12.9684,24.4219,13.7226,24.0224,14.3808Z" fill="#0084FF" fillOpacity="1" />
        </g>
      </svg>
    </div>
  );
};
