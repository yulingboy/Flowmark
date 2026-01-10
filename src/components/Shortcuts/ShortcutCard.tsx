import type { ShortcutItem } from '@/types';

interface ShortcutCardProps {
  item: ShortcutItem;
  onClick?: (item: ShortcutItem) => void;
  className?: string;
}

export function ShortcutCard({ item, onClick, className = '' }: ShortcutCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      window.open(item.url, '_blank');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center gap-1 cursor-pointer group w-full h-full ${className}`}
    >
      {/* 图标卡片 - 使用 flex-1 填满剩余空间 */}
      <div className="w-full flex-1 rounded-2xl overflow-hidden bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
        <img
          src={item.icon}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="eager"
          draggable={false}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `<span class="text-gray-600 text-2xl font-bold">${item.name[0]}</span>`;
          }}
        />
      </div>
      {/* 名称在卡片外面 */}
      <span className="text-white text-xs truncate drop-shadow w-full text-center flex-shrink-0">
        {item.name}
      </span>
    </button>
  );
}
