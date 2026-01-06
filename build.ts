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

// 编译 TypeScript 文件直接到 dist/
const buildTasks = [
  { src: 'src/content.ts', dest: 'content.js' },
  { src: 'src/background.ts', dest: 'background.js' },
  { src: 'src/popup.ts', dest: 'popup.js' },
];

for (const task of buildTasks) {
  const result = spawnSync('bun', ['build', task.src, '--outfile', `${distDir}/${task.dest}`, '--target', 'browser'], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(`❌ Failed to build ${task.src}`);
    process.exit(1);
  }
  console.log(`✓ Built ${task.src} → dist/${task.dest}`);
}

// 复制静态文件到 dist
fs.copyFileSync('manifest.json', `${distDir}/manifest.json`);
console.log(`✓ Copied manifest.json to dist/`);

fs.copyFileSync('popup.html', `${distDir}/popup.html`);
console.log(`✓ Copied popup.html to dist/`);

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
console.log('\n📦 Load the "dist" folder in Chrome at chrome://extensions/');
console.log('   Or share ' + zipFile + ' with others.\n');
