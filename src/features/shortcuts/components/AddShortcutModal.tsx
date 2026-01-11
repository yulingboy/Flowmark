import { useState, useEffect } from 'react';
import { Modal, Input, Switch, Button, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { getFaviconUrl } from '../utils/faviconService';
import { extractSiteInfo } from '../utils/siteInfo';
import type { ShortcutItem } from '@/types';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shortcut: { id?: string; name: string; url: string; icon: string; description?: string; openMode: 'tab' | 'popup'; bgColor?: string }) => void;
  editItem?: ShortcutItem | null;
}

const BG_COLORS = ['transparent', '#ffffff', '#3b82f6', '#eab308', '#ef4444', '#6b7280', '#22c55e', '#14532d', '#fbbf24', '#78350f', '#1e3a8a'];

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
      setUrl(editItem.url); setName(editItem.name); setIconUrl(editItem.icon); setPreviewIcon(editItem.icon); setIsPopupMode(editItem.openMode === 'popup');
    }
  }, [editItem, isOpen]);

  useEffect(() => {
    if (url && url.startsWith('http') && !isEditMode) {
      const timer = setTimeout(() => { const favicon = getFaviconUrl(url); setPreviewIcon(favicon); if (!iconUrl) setIconUrl(favicon); }, 500);
      return () => clearTimeout(timer);
    }
  }, [url, isEditMode, iconUrl]);

  const handleFetchIcon = async () => {
    if (!url) return;
    setIsLoading(true);
    try {
      const favicon = getFaviconUrl(url); setPreviewIcon(favicon); setIconUrl(favicon);
      const siteInfo = extractSiteInfo(url);
      if (siteInfo) { if (!name) setName(siteInfo.name); if (!description) setDescription(siteInfo.description); }
    } finally { setIsLoading(false); }
  };

  const resetForm = () => { setUrl(''); setName(''); setDescription(''); setTextIcon(''); setIconUrl(''); setSelectedBgColor('transparent'); setIsPopupMode(false); setPreviewIcon(''); };

  const handleSave = () => {
    if (!url || !name) return;
    onSave({ id: editItem?.id, name, url: url.startsWith('http') ? url : `https://${url}`, icon: iconUrl || previewIcon || getFaviconUrl(url), description, openMode: isPopupMode ? 'popup' : 'tab', bgColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined });
    resetForm(); onClose();
  };

  const handleSaveAndContinue = () => {
    if (!url || !name) return;
    onSave({ id: editItem?.id, name, url: url.startsWith('http') ? url : `https://${url}`, icon: iconUrl || previewIcon || getFaviconUrl(url), description, openMode: isPopupMode ? 'popup' : 'tab', bgColor: selectedBgColor !== 'transparent' ? selectedBgColor : undefined });
    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onload = (event) => { setIconUrl(event.target?.result as string); setPreviewIcon(event.target?.result as string); }; reader.readAsDataURL(file); }
  };

  return (
    <Modal title={isEditMode ? '编辑标签' : '添加标签'} open={isOpen} onCancel={() => { resetForm(); onClose(); }} width={700} destroyOnHidden
      footer={<Space>{!isEditMode && <Button onClick={handleSaveAndContinue} disabled={!url || !name}>保存并继续</Button>}<Button type="primary" onClick={handleSave} disabled={!url || !name}>{isEditMode ? '保存修改' : '保存'}</Button></Space>}>
      <div className="flex flex-col gap-4 py-4">
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">网络地址</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="请输入带http开头的网址" maxLength={1000} suffix={<span className="text-xs text-gray-400">{url.length}/1000</span>} />
          <Button onClick={handleFetchIcon} disabled={!url} loading={isLoading}>获取图标</Button>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">链接名称</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="标签名称" maxLength={100} suffix={<span className="text-xs text-gray-400">{name.length}/100</span>} />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">网址简介</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简单介绍标签（非必填）" maxLength={200} suffix={<span className="text-xs text-gray-400">{description.length}/200</span>} />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">文字图标</label>
          <Input value={textIcon} onChange={(e) => setTextIcon(e.target.value.slice(0, 5))} placeholder="请输入1-5个字符" maxLength={5} style={{ width: 200 }} />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">图片图标</label>
          <Input value={iconUrl} onChange={(e) => { setIconUrl(e.target.value); setPreviewIcon(e.target.value); }} placeholder="请上传或粘贴标签图标地址" />
          <Button><label className="cursor-pointer">手动上传<input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" /></label></Button>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">选择图标</label>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: selectedBgColor === 'transparent' ? '#fbbf24' : selectedBgColor }}>
            {previewIcon ? <img src={previewIcon} alt="icon" className="w-10 h-10 object-contain" onError={() => setPreviewIcon('')} />
              : textIcon ? <span className="text-white text-lg font-bold">{textIcon}</span>
              : <HomeOutlined style={{ fontSize: 32, color: 'white' }} />}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">背景颜色</label>
          <div className="flex items-center gap-2">
            {BG_COLORS.map((color, i) => (
              <button key={i} onClick={() => setSelectedBgColor(color)}
                className={`w-8 h-8 rounded border-2 cursor-pointer ${selectedBgColor === color ? 'border-blue-500' : 'border-gray-200'}`}
                style={{ backgroundColor: color === 'transparent' ? '#f3f4f6' : color, backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none', backgroundSize: '8px 8px', backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px' }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="w-20 text-sm text-gray-600 text-right shrink-0">内嵌窗口</label>
          <div className="flex items-center gap-3">
            <Switch checked={isPopupMode} onChange={setIsPopupMode} />
            <span className="text-sm text-blue-500">内嵌窗口形式打开，第三方可能不兼容</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
