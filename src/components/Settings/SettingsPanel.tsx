import { useState } from 'react';
import { Modal, Menu } from 'antd';
import { SettingOutlined, SearchOutlined, PictureOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
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

const tabContent: Record<SettingsTab, React.ReactNode> = {
  general: <GeneralSettings />,
  search: <SearchSettings />,
  wallpaper: <WallpaperSettings />,
  datetime: <DateTimeSettings />,
  about: <AboutSettings />,
};

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      styles={{ body: { padding: 0, height: 480 } }}
      destroyOnHidden
    >
      <div className="flex h-[480px]">
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
    </Modal>
  );
}
