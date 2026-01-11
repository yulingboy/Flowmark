import { useState, useRef } from 'react';
import { Modal, Menu } from 'antd';
import { SettingOutlined, SearchOutlined, PictureOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
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
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null!);

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) return;
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const tabContent: Record<SettingsTab, React.ReactNode> = {
    general: <GeneralSettings />,
    search: <SearchSettings />,
    wallpaper: <WallpaperSettings />,
    datetime: <DateTimeSettings />,
    about: <AboutSettings />,
  };

  return (
    <Modal
      title={
        <div
          style={{ width: '100%', cursor: 'move' }}
          onMouseOver={() => disabled && setDisabled(false)}
          onMouseOut={() => setDisabled(true)}
          onFocus={() => {}}
          onBlur={() => {}}
        >
          {menuItems.find(t => t.key === activeTab)?.label}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      styles={{ body: { padding: 0, height: 480 } }}
      destroyOnHidden
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          onStart={onStart}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
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
