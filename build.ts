import * as fs from 'fs';
import { spawnSync } from 'child_process';

const distDir = 'dist';
const zipFile = 'weread-auto-pager.zip';

// 清理并创建dist目录
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir, { recursive: true });

console.log('Building extension...');

// 复制所有必要的文件
const files = [
  ['manifest.json', 'manifest.json'],
  ['content.js', 'content.js'],
  ['background.js', 'background.js'],
  ['popup.js', 'popup.js'],
  ['popup.html', 'popup.html'],
];

for (const [src, dest] of files) {
  fs.copyFileSync(src, `${distDir}/${dest}`);
  console.log(`✓ Copied ${src}`);
}

// 删除旧的zip文件
if (fs.existsSync(zipFile)) {
  fs.rmSync(zipFile);
}

// 打包成zip
console.log('\nPackaging into zip...');
const zipResult = spawnSync('zip', ['-r', '-q', zipFile, 'dist'], {
  stdio: 'inherit',
});

if (zipResult.status === 0) {
  const stats = fs.statSync(zipFile);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`✓ Created ${zipFile} (${sizeKB} KB)`);
} else {
  console.log('⚠ Failed to create zip file');
}

console.log('\n✅ Build complete!');
console.log('\n📦 Share ' + zipFile + ' with others.');
console.log('   They just need to unzip and load the "dist" folder in Chrome.\n');
