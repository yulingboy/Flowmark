import { useState, useEffect, useRef } from 'react';
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

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  {
    id: 'general',
    label: '常规设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'search',
    label: '搜索设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    id: 'wallpaper',
    label: '壁纸设置',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'datetime',
    label: '时间日期',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: '关于我们',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={panelRef}
        className="bg-white rounded-2xl shadow-2xl w-[720px] h-[520px] flex overflow-hidden"
      >
        {/* 左侧导航 */}
        <div className="w-50 bg-gray-50 border-r border-gray-200 py-5 flex flex-col">
          <nav className="flex-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-3 px-4 flex items-center gap-3 border-none cursor-pointer text-sm text-left border-l-3 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-500 border-l-blue-500'
                    : 'bg-transparent text-gray-500 border-l-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-800">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full border-none bg-transparent cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'search' && <SearchSettings />}
            {activeTab === 'wallpaper' && <WallpaperSettings />}
            {activeTab === 'datetime' && <DateTimeSettings />}
            {activeTab === 'about' && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}
