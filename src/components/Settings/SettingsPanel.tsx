import { useState, useRef, useCallback, useEffect } from 'react';
import { Menu } from 'antd';
import { SettingOutlined, SearchOutlined, PictureOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { createPortal } from 'react-dom';
import { GeneralSettings } from './tabs/GeneralSettings';
import { SearchSettings } from './tabs/SearchSettings';
import { WallpaperSettings } from './tabs/WallpaperSettings';
import { DateTimeSettings } from './tabs/DateTimeSettings';
import { AboutSettings } from './tabs/AboutSettings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'search' | 'wallpaper' | 'datetime' | 'about';

const menuItems = [
  { key: 'general', icon: <SettingOutlined />, label: '常规设置' },
  { key: 'search', icon: <SearchOutlined />, label: '搜索设置' },
  { key: 'wallpaper', icon: <PictureOutlined />, label: '壁纸设置' },
  { key: 'datetime', icon: <ClockCircleOutlined />, label: '时间日期' },
  { key: 'about', icon: <InfoCircleOutlined />, label: '关于我们' },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // 重置位置
  useEffect(() => {
    if (isOpen) setPosition({ x: 0, y: 0 });
  }, [isOpen]);

  // 拖拽处理
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: dragStartRef.current.posX + (e.clientX - dragStartRef.current.x),
        y: dragStartRef.current.posY + (e.clientY - dragStartRef.current.y),
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // 键盘和点击外部关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (!isDragging && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isDragging]);

  if (!isOpen) return null;

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    general: <GeneralSettings />,
    search: <SearchSettings />,
    wallpaper: <WallpaperSettings />,
    datetime: <DateTimeSettings />,
    about: <AboutSettings />,
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        className="bg-white rounded-2xl shadow-2xl w-[720px] h-[520px] flex flex-col overflow-hidden"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Header - 可拖拽 */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-gray-200 cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-base font-semibold text-gray-800">
            {menuItems.find(t => t.key === activeTab)?.label}
          </h2>
          <button
            onClick={onClose}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1 rounded-full border-none bg-transparent cursor-pointer hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            items={menuItems}
            onClick={({ key }) => setActiveTab(key as SettingsTab)}
            style={{ width: 180, height: '100%', borderRight: '1px solid #f0f0f0' }}
          />
          <div className="flex-1 p-6 overflow-y-auto">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
