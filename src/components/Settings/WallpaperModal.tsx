import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSettingsStore } from '@/stores/settingsStore';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 预设壁纸列表
const presetWallpapers = [
  { id: '1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', name: '山峰' },
  { id: '2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', name: '森林' },
  { id: '3', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80', name: '海洋' },
  { id: '4', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', name: '雪山' },
  { id: '5', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', name: '峡谷' },
  { id: '6', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1920&q=80', name: '湖泊' },
  { id: '7', url: 'https://images.unsplash.com/photo-1518173946687-a4c036bc3c95?w=1920&q=80', name: '极光' },
  { id: '8', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80', name: '日落' },
];

export function WallpaperModal({ isOpen, onClose }: WallpaperModalProps) {
  const { backgroundUrl, updateBackgroundUrl } = useSettingsStore();
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');

  if (!isOpen) return null;

  const handleSelectPreset = (url: string) => {
    updateBackgroundUrl(url);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      updateBackgroundUrl(customUrl.trim());
      setCustomUrl('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateBackgroundUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[520px] max-h-[80vh] overflow-hidden flex flex-col">
        {/* 标题 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">更换壁纸</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-500">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 标签页 */}
        <div className="px-6 pt-4 flex gap-4 border-b border-gray-100">
          <button onClick={() => setActiveTab('preset')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preset' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            预设壁纸
          </button>
          <button onClick={() => setActiveTab('custom')}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'custom' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            自定义
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preset' ? (
            <div className="grid grid-cols-3 gap-3">
              {presetWallpapers.map((wp) => (
                <button key={wp.id} onClick={() => handleSelectPreset(wp.url)}
                  className={`relative aspect-video rounded-xl overflow-hidden group ${backgroundUrl === wp.url ? 'ring-2 ring-blue-500' : ''}`}>
                  <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  <span className="absolute bottom-1 left-2 text-xs text-white drop-shadow">{wp.name}</span>
                  {backgroundUrl === wp.url && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* URL输入 */}
              <form onSubmit={handleCustomSubmit}>
                <label className="block text-sm font-medium text-gray-700 mb-2">图片链接</label>
                <div className="flex gap-2">
                  <input type="url" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" />
                  <button type="submit" disabled={!customUrl.trim()}
                    className="px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    应用
                  </button>
                </div>
              </form>

              {/* 本地上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">本地上传</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-gray-400 mb-2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <span className="text-sm text-gray-500">点击选择图片</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
