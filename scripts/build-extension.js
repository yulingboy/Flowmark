import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const extDir = path.join(rootDir, 'extension');

// 创建 extension 目录
if (fs.existsSync(extDir)) {
  fs.rmSync(extDir, { recursive: true });
}
fs.mkdirSync(extDir, { recursive: true });

// 复制 dist 目录内容到 extension
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(distDir, extDir);

// 生成不同尺寸的图标占位文件说明
const iconsDir = path.join(extDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 复制 SVG 图标
const svgSrc = path.join(rootDir, 'public/icons/icon.svg');
if (fs.existsSync(svgSrc)) {
  fs.copyFileSync(svgSrc, path.join(iconsDir, 'icon.svg'));
}

// 创建图标说明文件
fs.writeFileSync(
  path.join(iconsDir, 'README.md'),
  `# 扩展图标

请将以下尺寸的 PNG 图标放置在此目录：
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

可以使用 icon.svg 作为源文件生成这些图标。
`
);

console.log('✅ 浏览器扩展已打包到 extension/ 目录');
console.log('');
console.log('📦 安装步骤：');
console.log('1. 打开 Chrome，访问 chrome://extensions/');
console.log('2. 开启「开发者模式」');
console.log('3. 点击「加载已解压的扩展程序」');
console.log('4. 选择 extension/ 目录');
console.log('');
console.log('⚠️  注意：请先在 extension/icons/ 目录添加 PNG 图标文件');
