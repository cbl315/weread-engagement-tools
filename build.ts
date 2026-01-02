import * as fs from 'fs';
import * as path from 'path';
import { build } from 'bun';

// 确保dist目录存在
const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 构建content script
await build({
  entrypoints: [path.join(process.cwd(), 'src', 'content.ts')],
  outfile: path.join(distDir, 'content.js'),
  target: 'browser',
  minify: false,
});

// 构建background script
await build({
  entrypoints: [path.join(process.cwd(), 'src', 'background.ts')],
  outfile: path.join(distDir, 'background.js'),
  target: 'browser',
  minify: false,
});

// 构建popup script
await build({
  entrypoints: [path.join(process.cwd(), 'src', 'popup.ts')],
  outfile: path.join(distDir, 'popup.js'),
  target: 'browser',
  minify: false,
});

// 复制manifest.json
fs.copyFileSync(
  path.join(process.cwd(), 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// 复制popup.html
fs.copyFileSync(
  path.join(process.cwd(), 'src', 'popup.html'),
  path.join(distDir, 'popup.html')
);

console.log('Build complete! Output in ./dist directory');
console.log('Load the extension in Chrome/Edge:');
console.log('1. Open chrome://extensions/');
console.log('2. Enable Developer mode');
console.log('3. Click "Load unpacked"');
console.log('4. Select the dist folder');
