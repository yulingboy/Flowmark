import { useState } from 'react';
import { Input, Button, Empty, List } from 'antd';
import { PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { useNotes, formatFullTime } from './useNotes';

const { Search, TextArea } = Input;

// 弹窗视图 - 左右分栏布局
export function NotesModal() {
  const { notes, addNote, updateNote, deleteNote, clearAllNotes } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedNote = notes.find(n => n.id === selectedId);

  // 过滤笔记
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const id = addNote();
    setSelectedId(id);
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* 左侧列表 */}
      <div className="w-[260px] flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
        {/* 搜索和新建 */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex gap-2">
            <Search
              placeholder="搜索笔记标题"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              allowClear
              size="middle"
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            />
          </div>
        </div>

        {/* 笔记列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Empty description="暂无数据" />
            </div>
          ) : (
            <List
              dataSource={filteredNotes}
              renderItem={(note) => (
                <List.Item
                  onClick={() => handleSelect(note.id)}
                  className={`!px-3 !py-2 mx-2 my-1 rounded-lg cursor-pointer transition-colors group ${
                    selectedId === note.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100"
                    />
                  ]}
                >
                  <List.Item.Meta
                    title={<span className="text-blue-500 text-sm">{note.title || '未命名笔记'}</span>}
                    description={<span className="text-xs text-gray-400">更新时间：{formatFullTime(note.updatedAt)}</span>}
                  />
                </List.Item>
              )}
            />
          )}
        </div>

        {/* 底部操作 */}
        <div className="p-3 border-t border-gray-100">
          <Button
            danger
            block
            onClick={clearAllNotes}
            disabled={notes.length === 0}
          >
            清除所有内容
          </Button>
        </div>
      </div>

      {/* 右侧编辑区 */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedNote ? (
          <>
            {/* 标题栏 */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <Input
                placeholder="未命名笔记"
                value={selectedNote.title}
                onChange={e => updateNote(selectedNote.id, { title: e.target.value })}
                variant="borderless"
                className="flex-1 font-medium"
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setSelectedId(null)}
              />
            </div>
            
            {/* 内容编辑区 */}
            <div className="flex-1 p-4 overflow-hidden">
              <TextArea
                placeholder="笔记内容（最大5000字符）"
                value={selectedNote.content}
                onChange={e => {
                  if (e.target.value.length <= 5000) {
                    updateNote(selectedNote.id, { content: e.target.value });
                  }
                }}
                maxLength={5000}
                showCount
                style={{ height: '100%', resize: 'none' }}
              />
            </div>
            
            {/* 底部状态栏 */}
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>3s 延迟自动保存</span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setSelectedId(null)}>
                  取消
                </Button>
                <Button type="primary" onClick={() => setSelectedId(null)}>
                  保存
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Empty description="暂无内容，请先创建/选中笔记" />
          </div>
        )}
      </div>
    </div>
  );
}
