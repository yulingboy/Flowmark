import { useState, useRef } from 'react';
import { Modal, Tabs, Input, Button, Slider } from 'antd';
import { UploadOutlined, CheckOutlined } from '@ant-design/icons';
import { useSettingsStore } from '@/stores/settingsStore';
import { PRESET_WALLPAPERS } from '@/constants';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WallpaperModal({ isOpen, onClose }: WallpaperModalProps) {
  const { 
    backgroundUrl, backgroundBlur, backgroundOverlay,
    updateBackgroundUrl, updateBackgroundBlur, updateBackgroundOverlay, resetBackground 
  } = useSettingsStore();
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => updateBackgroundUrl(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const tabItems = [
    {
      key: 'preset',
      label: '预设壁纸',
      children: (
        <div className="grid grid-cols-3 gap-3">
          {PRESET_WALLPAPERS.map((wp) => (
            <button key={wp.id} onClick={() => updateBackgroundUrl(wp.url)}
              className={`relative aspect-video rounded-xl overflow-hidden group cursor-pointer border-0 p-0 ${backgroundUrl === wp.url ? 'ring-2 ring-blue-500' : ''}`}>
              <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              <span className="absolute bottom-1 left-2 text-xs text-white drop-shadow">{wp.name}</span>
              {backgroundUrl === wp.url && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <CheckOutlined style={{ color: 'white', fontSize: 12 }} />
                </div>
              )}
            </button>
          ))}
        </div>
      ),
    },
    {
      key: 'custom',
      label: '自定义',
      children: (
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-700 mb-2">图片链接</div>
            <div className="flex gap-2">
              <Input value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="https://example.com/image.jpg" />
              <Button type="primary" disabled={!customUrl.trim()} onClick={() => { updateBackgroundUrl(customUrl.trim()); setCustomUrl(''); }}>应用</Button>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-700 mb-2">本地上传</div>
            <div onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
              <UploadOutlined style={{ fontSize: 32, color: '#9ca3af', marginBottom: 8 }} />
              <span className="text-sm text-gray-500">点击选择图片</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'adjust',
      label: '调整',
      children: (
        <div className="space-y-6">
          <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 relative">
            <img src={backgroundUrl} alt="预览" className="w-full h-full object-cover" style={{ filter: `blur(${backgroundBlur / 10}px)` }} />
            <div className="absolute inset-0" style={{ backgroundColor: `rgba(0, 0, 0, ${backgroundOverlay / 100})` }} />
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-700 mb-2"><span>背景模糊</span><span>{backgroundBlur}%</span></div>
            <Slider min={0} max={100} value={backgroundBlur} onChange={updateBackgroundBlur} />
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-700 mb-2"><span>遮罩透明度</span><span>{backgroundOverlay}%</span></div>
            <Slider min={0} max={80} value={backgroundOverlay} onChange={updateBackgroundOverlay} />
          </div>
          <Button onClick={resetBackground} block>恢复默认</Button>
        </div>
      ),
    },
  ];

  return (
    <Modal title="更换壁纸" open={isOpen} onCancel={onClose} footer={null} width={520} destroyOnHidden>
      <Tabs items={tabItems} />
    </Modal>
  );
}
