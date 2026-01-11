import { useState, useEffect } from 'react';
import { Modal } from '@/components/common';
import { getFaviconUrl } from '@/utils/favicon';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: {
    name: string;
    url: string;
    icon: string;
    description?: string;
    openMode: 'tab' | 'popup';
    bgColor?: string;
  }) => void;
}

const BG_COLORS = [
  'transparent',
  '#ffffff',
  '#3b82f6',
  '#eab308',
  '#ef4444',
  '#6b7280',
  '#22c55e',
  '#14532d',
  '#fbbf24',
  '#78350f',
  '#1e3a8a',
];

export function AddShortcutModal({ isOpen, onClose, onSave }: AddShortcutModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [textIcon, setTextIcon] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState('transparent');
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [previewIcon, setPreviewIcon] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL 变化时自动获取图标
  useEffect(() => {
    if (url && url.startsWith('http')) {
      const timer = setTimeout(() => {
        const favicon = getFaviconUrl(url);
        setPreviewIcon(favicon);
        if (!iconUrl) {
          setIconUrl(favicon);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [url]);

  const handleFetchIcon = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const favicon = getFaviconUrl(url);
      setPreviewIcon(favicon);
      setIconUrl(favicon);
      
      // 尝试从 URL 获取网站标题作为名称
      if (!name) {
        try {
          const urlObj = new URL(url);
          const hostname = urlObj.hostname.replace('www.', '');
          const siteName = hostname.split('.')[0];
          setName(siteName.charAt(0).toUpperCase() + siteName.slice(1));
        } catch {
          // 忽略错误
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!url || !name) return;
    
    onSave({
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      icon: iconUrl || previewIcon || getFaviconUrl(url),
      description,
      openMode: isPopupMode ? 'popup' : 'tab',
      bgColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined,
    });
    
    resetForm();
    onClose();
  };

  const handleSaveAndContinue = () => {
    if (!url || !name) return;
    
    onSave({
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      icon: iconUrl || previewIcon || getFaviconUrl(url),
      description,
      openMode: isPopupMode ? 'popup' : 'tab',
      bgColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined,
    });
    
    resetForm();
  };

  const resetForm = () => {
    setUrl('');
    setName('');
    setDescription('');
    setTextIcon('');
    setIconUrl('');
    setSelectedBgColor('transparent');
    setIsPopupMode(false);
    setPreviewIcon('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconUrl(result);
        setPreviewIcon(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" width="700px" closeOnBackdrop={false}>
      <div className="flex flex-col gap-4">
        {/* 表单内容 */}
        <div className="flex flex-col gap-4">
          {/* 网络地址 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">网络地址</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入带http开头的网址"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {url.length} / 1000
              </span>
            </div>
            <button
              onClick={handleFetchIcon}
              disabled={!url || isLoading}
              className="px-4 py-2 text-blue-500 bg-transparent border border-blue-500 rounded-lg text-sm cursor-pointer hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '获取中...' : '获取图标'}
            </button>
          </div>

          {/* 链接名称 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">链接名称</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="标签名称"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {name.length} / 100
              </span>
            </div>
          </div>

          {/* 网址简介 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">网址简介</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简单介绍标签（非必填）"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {description.length} / 200
              </span>
            </div>
          </div>

          {/* 文字图标 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">文字图标</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={textIcon}
                onChange={(e) => setTextIcon(e.target.value.slice(0, 5))}
                placeholder="请输入1-5个字符（当图标获取不到时使用）"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {textIcon.length} / 5
              </span>
            </div>
          </div>

          {/* 图片图标 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">图片图标</label>
            <div className="flex-1 relative">
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => {
                  setIconUrl(e.target.value);
                  setPreviewIcon(e.target.value);
                }}
                placeholder="请上传或粘贴标签图标地址,支持png,jpg,ico,svg,webp格式"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400"
              />
            </div>
            <label className="px-4 py-2 text-blue-500 bg-transparent border border-blue-500 rounded-lg text-sm cursor-pointer hover:bg-blue-50">
              手动上传
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* 选择图标预览 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">选择图标</label>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: selectedBgColor === 'transparent' ? '#fbbf24' : selectedBgColor }}
            >
              {previewIcon ? (
                <img 
                  src={previewIcon} 
                  alt="icon" 
                  className="w-10 h-10 object-contain"
                  onError={() => setPreviewIcon('')}
                />
              ) : textIcon ? (
                <span className="text-white text-lg font-bold">{textIcon}</span>
              ) : (
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              )}
            </div>
          </div>

          {/* 背景颜色 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">背景颜色</label>
            <div className="flex items-center gap-2">
              {BG_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBgColor(color)}
                  className={`w-8 h-8 rounded border-2 cursor-pointer ${
                    selectedBgColor === color ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  style={{
                    backgroundColor: color === 'transparent' ? '#f3f4f6' : color,
                    backgroundImage: color === 'transparent' 
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                      : 'none',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* 内嵌窗口 */}
          <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-gray-600 text-right shrink-0">内嵌窗口</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPopupMode(!isPopupMode)}
                className={`w-12 h-6 rounded-full relative cursor-pointer border-none transition-colors ${
                  isPopupMode ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    isPopupMode ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
              <span className="text-sm text-blue-500">内嵌窗口形式打开，第三方可能不兼容</span>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!url || !name}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg text-sm cursor-pointer border-none hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            保存
          </button>
          <button
            onClick={handleSaveAndContinue}
            disabled={!url || !name}
            className="px-6 py-3 text-blue-500 bg-transparent border-none cursor-pointer text-sm hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            保存并继续 →
          </button>
        </div>
      </div>
    </Modal>
  );
}
