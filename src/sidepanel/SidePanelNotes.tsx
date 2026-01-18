/**
 * Side Panel 笔记管理组件
 * 
 * 左右分栏布局，支持 Markdown 编辑器：
 * - 左侧：可收起的笔记列表
 * - 右侧：Markdown 编辑器（支持实时预览）
 * - 支持导出为 Markdown 和 HTML
 * 
 * @module sidepanel/SidePanelNotes
 */

import { useState } from 'react';
import { Input, Button, Empty, List, Tooltip, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  ExportOutlined,
  FileMarkdownOutlined,
  Html5Outlined
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { marked } from 'marked';
import { useNotes, formatFullTime } from '../plugins/builtin/notes/useNotes';

const { Search } = Input;

/** 笔记内容最大长度限制 */
const MAX_CONTENT_LENGTH = 50000;

/**
 * 下载文件
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 生成 HTML 文档
 */
function generateHtmlDocument(title: string, content: string): string {
  const htmlContent = marked(content);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || '未命名笔记'}</title>
  <style>
    body {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: #f5f5f5; padding: 16px; border-radius: 6px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; }
    img { max-width: 100%; }
    a { color: #1890ff; }
  </style>
</head>
<body>
  <h1>${title || '未命名笔记'}</h1>
  ${htmlContent}
</body>
</html>`;
}

/**
 * Side Panel 笔记管理组件
 */
export function SidePanelNotes() {
  const { notes, isLoading, addNote, updateNote, deleteNote } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedId);

  // 过滤笔记
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 新建笔记
  const handleAdd = async () => {
    const id = await addNote();
    setSelectedId(id);
  };

  // 选中笔记
  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  // 删除笔记
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  // 更新笔记标题
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNote) {
      updateNote(selectedNote.id, { title: e.target.value });
    }
  };

  // 更新笔记内容
  const handleContentChange = (value?: string) => {
    if (selectedNote && value !== undefined && value.length <= MAX_CONTENT_LENGTH) {
      updateNote(selectedNote.id, { content: value });
    }
  };

  // 导出为 Markdown
  const handleExportMarkdown = () => {
    if (!selectedNote) return;
    const filename = `${selectedNote.title || '未命名笔记'}.md`;
    downloadFile(selectedNote.content, filename, 'text/markdown;charset=utf-8');
  };

  // 导出为 HTML
  const handleExportHtml = () => {
    if (!selectedNote) return;
    const filename = `${selectedNote.title || '未命名笔记'}.html`;
    const html = generateHtmlDocument(selectedNote.title, selectedNote.content);
    downloadFile(html, filename, 'text/html;charset=utf-8');
  };

  // 导出菜单
  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'md',
      icon: <FileMarkdownOutlined />,
      label: '导出 Markdown (.md)',
      onClick: handleExportMarkdown,
    },
    {
      key: 'html',
      icon: <Html5Outlined />,
      label: '导出 HTML (.html)',
      onClick: handleExportHtml,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white" data-color-mode="light">
      {/* 左侧列表 */}
      <div 
        className={`flex flex-col border-r border-gray-200 transition-all duration-300 ${
          collapsed ? 'w-12' : 'w-56'
        }`}
      >
        {/* 列表头部 */}
        <div className="flex items-center justify-between p-2 border-b border-gray-100">
          {!collapsed && (
            <span className="text-sm font-medium text-gray-700">笔记</span>
          )}
          <Tooltip title={collapsed ? '展开列表' : '收起列表'}>
            <Button
              type="text"
              size="small"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </Tooltip>
        </div>

        {/* 搜索和新建 */}
        {!collapsed && (
          <div className="p-2 border-b border-gray-100">
            <div className="flex gap-1">
              <Search
                placeholder="搜索"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                allowClear
                size="small"
                className="flex-1"
              />
              <Tooltip title="新建笔记">
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                />
              </Tooltip>
            </div>
          </div>
        )}

        {/* 收起时只显示新建按钮 */}
        {collapsed && (
          <div className="p-2 flex justify-center">
            <Tooltip title="新建笔记" placement="right">
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              />
            </Tooltip>
          </div>
        )}

        {/* 笔记列表 */}
        <div className="flex-1 overflow-y-auto">
          {!collapsed && (
            filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-4">
                <Empty 
                  description={searchQuery ? '无匹配' : '暂无笔记'} 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <List
                size="small"
                dataSource={filteredNotes}
                renderItem={(note) => (
                  <List.Item
                    onClick={() => handleSelect(note.id)}
                    className={`!px-2 !py-1.5 mx-1 my-0.5 rounded cursor-pointer transition-colors group ${
                      selectedId === note.id 
                        ? 'bg-blue-50 border-l-2 border-l-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                    style={{ border: 'none' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm truncate text-gray-700">
                        {note.title || '未命名'}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {formatFullTime(note.updatedAt)}
                      </div>
                    </div>
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDelete(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-1"
                    />
                  </List.Item>
                )}
              />
            )
          )}
        </div>

        {/* 底部统计 */}
        {!collapsed && (
          <div className="px-2 py-1 border-t border-gray-100 text-xs text-gray-400 text-center">
            {notes.length} 条
          </div>
        )}
      </div>

      {/* 右侧编辑区 */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedNote ? (
          <>
            {/* 标题栏 */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
              <Input
                placeholder="未命名笔记"
                value={selectedNote.title}
                onChange={handleTitleChange}
                variant="borderless"
                className="flex-1 font-medium text-base"
              />
              <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                <Button size="small" icon={<ExportOutlined />}>
                  导出
                </Button>
              </Dropdown>
            </div>

            {/* Markdown 编辑器 */}
            <div className="flex-1 overflow-hidden">
              <MDEditor
                value={selectedNote.content}
                onChange={handleContentChange}
                height="100%"
                preview="edit"
                hideToolbar={false}
                enableScroll={true}
                visibleDragbar={false}
                style={{ 
                  height: '100%',
                  borderRadius: 0,
                  border: 'none'
                }}
              />
            </div>

            {/* 底部状态栏 */}
            <div className="px-3 py-1.5 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
              <span>{formatFullTime(selectedNote.updatedAt)}</span>
              <span>{selectedNote.content.length} 字符</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Empty description="选择或新建笔记" />
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAdd}
              className="mt-4"
            >
              新建笔记
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
