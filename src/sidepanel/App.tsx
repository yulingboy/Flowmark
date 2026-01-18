/**
 * Side Panel 根组件
 * 
 * 设置 Ant Design ConfigProvider 并渲染 SidePanelNotes 组件
 * 
 * @module sidepanel/App
 * @requirement 1.4 - THE Side_Panel SHALL 加载独立构建的 React 应用
 */

import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { SidePanelNotes } from './SidePanelNotes';

/**
 * Side Panel 根组件
 * 
 * 提供 Ant Design 主题配置和中文本地化支持
 */
function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          // 紧凑的间距，适合侧边栏
          borderRadius: 6,
          colorPrimary: '#1677ff',
        },
        components: {
          // 针对侧边栏优化的组件样式
          Input: {
            paddingInline: 8,
          },
          List: {
            paddingContentHorizontal: 12,
          },
        },
      }}
    >
      <div className="h-screen flex flex-col bg-white">
        <SidePanelNotes />
      </div>
    </ConfigProvider>
  );
}

export default App;
