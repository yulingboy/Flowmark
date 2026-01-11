import { useState, useEffect } from 'react';
import { Modal } from '@/components/common';
import { getFaviconUrl } from '@/utils/favicon';
import { extractSiteInfo } from '@/utils/siteInfo';
import type { ShortcutItem } from '@/types';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: {
    id?: string;
    name: string;
    url: string;
    icon: string;
    description?: string;
    openMode: 'tab' | 'popup';
    bgColor?: string;
  }) => void;
  editItem?: ShortcutItem | null;
}

const BG_COLORS = [
  'transparent', '#ffffff', '#3b82f6', '#eab308', '#ef4444',
  '#6b7280', '#22c55e', '#14532d', '#fbbf24', '#78350f', '#1e3a8a',
];

export function AddShortcutModal({ isOpen, onClose, onSave, editItem }: AddShortcutModalProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [textIcon, setTextIcon] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [selectedBgColor, setSelectedBgColor] = useState('transparent');
  const [isPopupMode, setIsPopupMode] = useState(false);
  const [previewIcon, setPreviewIcon] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!editItem;

  useEffect(() => {
    if (editItem && isOpen) {
      setUrl(editItem.url);
      setName(editItem.name);
      setIconUrl(editItem.icon);
      setPreviewIcon(editItem.icon);
      setIsPopupMode(editItem.openMode === 'popup');
    }
  }, [editItem, isOpen]);

  useEffect(() => {
    if (url && url.startsWith('http') && !isEditMode) {
      const timer = setTimeout(() => {
        const favicon = getFaviconUrl(url);
        setPreviewIcon(favicon);
        if (!iconUrl) setIconUrl(favicon);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [url, isEditMode]);

  const handleFetchIcon = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const favicon = getFaviconUrl(url);
      setPreviewIcon(favicon);
      setIconUrl(favicon);
      const siteInfo = extractSiteInfo(url);
      if (siteInfo) {
        if (!name) setName(siteInfo.name);
        if (!description) setDescription(siteInfo.description);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUrl(''); setName(''); setDescription(''); setTextIcon('');
    setIconUrl(''); setSelectedBgColor('transparent');
    setIsPopupMode(false); setPreviewIcon('');
  };

  const handleSave = () => {
    if (!url || !name) return;
    onSave({
      id: editItem?.id,
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
      id: editItem?.id,
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
      icon: iconUrl || previewIcon || getFaviconUrl(url),
      description,
      openMode: isPopupMode ? 'popup' : 'tab',
      bgColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined,
    });
    resetForm();
  };

  const handleClose = () => { resetForm(); onClose(); };

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
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditMode ? '编辑标签' : '添加标签'} width="700px" closeOnBackdrop={false} draggable>
      <div className="flex flex-col gap-4">
        <FormField label="网络地址" value={url} onChange={setUrl} placeholder="请输入带http开头的网址" maxLength={1000}>
          <button onClick={handleFetchIcon} disabled={!url || isLoading}
            className="px-4 py-2 text-blue-500 bg-transparent border border-blue-500 rounded-lg text-sm cursor-pointer hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? '获取中...' : '获取图标'}
          </button>
        </FormField>

        <FormField label="链接名称" value={name} onChange={setName} placeholder="标签名称" maxLength={100} />
        <FormField label="网址简介" value={description} onChange={setDescription} placeholder="简单介绍标签（非必填）" maxLength={200} />
        <FormField label="文字图标" value={textIcon} onChange={(v) => setTextIcon(v.slice(0, 5))} placeholder="请输入1-5个字符" maxLength={5} />

        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">图片图标</label>
          <input type="text" value={iconUrl} onChange={(e) => { setIconUrl(e.target.value); setPreviewIcon(e.target.value); }}
            placeholder="请上传或粘贴标签图标地址" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400" />
          <label className="px-4 py-2 text-blue-500 bg-transparent border border-blue-500 rounded-lg text-sm cursor-pointer hover:bg-blue-50">
            手动上传<input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <IconPreview previewIcon={previewIcon} textIcon={textIcon} bgColor={selectedBgColor} onError={() => setPreviewIcon('')} />
        <ColorPicker colors={BG_COLORS} selected={selectedBgColor} onSelect={setSelectedBgColor} />
        <ToggleField label="内嵌窗口" value={isPopupMode} onChange={setIsPopupMode} hint="内嵌窗口形式打开，第三方可能不兼容" />

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <button onClick={handleSave} disabled={!url || !name}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg text-sm cursor-pointer border-none hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
            {isEditMode ? '保存修改' : '保存'}
          </button>
          {!isEditMode && (
            <button onClick={handleSaveAndContinue} disabled={!url || !name}
              className="px-6 py-3 text-blue-500 bg-transparent border-none cursor-pointer text-sm hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed">
              保存并继续 →
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// 子组件
function FormField({ label, value, onChange, placeholder, maxLength, children }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; maxLength: number; children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-20 text-sm text-gray-600 text-right shrink-0">{label}</label>
      <div className="flex-1 relative">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-400 pr-16" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{value.length} / {maxLength}</span>
      </div>
      {children}
    </div>
  );
}

function IconPreview({ previewIcon, textIcon, bgColor, onError }: { previewIcon: string; textIcon: string; bgColor: string; onError: () => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-20 text-sm text-gray-600 text-right shrink-0">选择图标</label>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: bgColor === 'transparent' ? '#fbbf24' : bgColor }}>
        {previewIcon ? <img src={previewIcon} alt="icon" className="w-10 h-10 object-contain" onError={onError} />
          : textIcon ? <span className="text-white text-lg font-bold">{textIcon}</span>
          : <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
            </svg>}
      </div>
    </div>
  );
}

function ColorPicker({ colors, selected, onSelect }: { colors: string[]; selected: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-20 text-sm text-gray-600 text-right shrink-0">背景颜色</label>
      <div className="flex items-center gap-2">
        {colors.map((color, i) => (
          <button key={i} onClick={() => onSelect(color)}
            className={`w-8 h-8 rounded border-2 cursor-pointer ${selected === color ? 'border-blue-500' : 'border-gray-200'}`}
            style={{
              backgroundColor: color === 'transparent' ? '#f3f4f6' : color,
              backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
              backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            }} />
        ))}
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint: string }) {
  return (
    <div className="flex items-center gap-4">
      <label className="w-20 text-sm text-gray-600 text-right shrink-0">{label}</label>
      <div className="flex items-center gap-3">
        <button onClick={() => onChange(!value)} className={`w-12 h-6 rounded-full relative cursor-pointer border-none transition-colors ${value ? 'bg-blue-500' : 'bg-gray-300'}`}>
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
        </button>
        <span className="text-sm text-blue-500">{hint}</span>
      </div>
    </div>
  );
}
