import { Heart, Keyboard, Github } from 'lucide-react';

export function AboutSettings() {
  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: '聚焦搜索框' },
    { keys: ['Ctrl', 'N'], description: '添加新快捷方式' },
    { keys: ['Ctrl', ','], description: '打开设置' },
    { keys: ['Esc'], description: '关闭弹窗' },
  ];

  return (
    <div className="space-y-4">
      {/* Logo 和应用信息 */}
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-gray-900 text-white text-lg font-semibold tracking-tight shadow-md">
          Flo
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Flowmark</h3>
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full mt-1 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-500">v1.0.0</span>
        </div>
        <p className="text-xs text-gray-400">简洁高效的浏览器起始页</p>
      </div>

      {/* 键盘快捷键 */}
      <div className="bg-gray-50/50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <Keyboard className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">快捷键</span>
        </div>
        <div className="space-y-1.5">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys.join('+')} className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{shortcut.description}</span>
              <div className="flex items-center gap-0.5">
                {shortcut.keys.map((key, index) => (
                  <span key={key} className="flex items-center">
                    <kbd className="min-w-[24px] px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500 text-center">
                      {key}
                    </kbd>
                    {index < shortcut.keys.length - 1 && (
                      <span className="text-gray-300 mx-0.5 text-xs">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部信息 */}
      <div className="flex items-center justify-between pt-2 text-[10px] text-gray-300">
        <a
          href="https://github.com/yulingboy/Flowmark"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-gray-400 transition-colors"
        >
          <Github className="w-3 h-3" />
          <span>GitHub</span>
        </a>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-2.5 h-2.5 text-red-300 fill-red-300" />
        </span>
      </div>
    </div>
  );
}
