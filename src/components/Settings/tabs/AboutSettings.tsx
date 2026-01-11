export function AboutSettings() {
  const shortcuts = [
    { keys: 'Ctrl + K', description: '聚焦搜索框' },
    { keys: 'Ctrl + N', description: '添加新快捷方式' },
    { keys: 'Ctrl + ,', description: '打开设置' },
    { keys: 'Escape', description: '关闭弹窗' },
  ];

  return (
    <div>
      <div className="text-center py-6">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          N
        </div>
        <h3 className="text-lg text-gray-800 mb-2">AI Nav</h3>
        <p className="text-sm text-gray-500 mb-1">版本 1.0.0</p>
        <p className="text-xs text-gray-400">一个简洁美观的新标签页</p>
      </div>

      {/* 键盘快捷键 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-700 mb-3">键盘快捷键</h4>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500 font-mono">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
