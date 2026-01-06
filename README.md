# WeRead Auto Pager

一个浏览器扩展，可以在微信读书网站上自动翻页。

## 功能

- 每隔 30-75 秒随机间隔自动点击"下一页"按钮
- 模拟真实用户行为（随机鼠标移动、轻微滚动）
- 通过弹出窗口控制开始/暂停
- 状态持久化，刷新页面后保持运行状态

## 构建扩展

```bash
# 安装 Bun（如果还没安装）
curl -fsSL https://bun.sh/install | bash

# 构建扩展（会自动打包成 zip）
bun run build
```

构建完成后会生成：
- `dist/` - 扩展文件夹（可直接加载）
- `weread-auto-pager.zip` - 分发包（可分享给他人）

## 在 Chrome 中使用

### 加载扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 打开右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `dist` 文件夹

### 使用扩展

1. 访问微信读书网站：`https://weread.qq.com/`
2. 点击浏览器工具栏中的扩展图标
3. 在弹出窗口中点击"开始"按钮
4. 扩展会自动每隔 30-75 秒点击"下一页"按钮
5. 点击"暂停"按钮可停止自动翻页

## 分享给他人

运行 `bun run build` 后，会生成 `weread-auto-pager.zip` 文件。

**分享方式：**
1. 发送 `weread-auto-pager.zip` 给他人
2. 对方解压 zip 文件
3. 在 Chrome 中加载解压后的 `dist` 文件夹

## 弹出窗口界面

**运行中状态：**
```
┌─────────────────────┐
│ WeRead Auto Pager   │
│                     │
│   [ 运行中 ]        │  绿色背景
│    [ 暂停 ]         │  红色按钮
└─────────────────────┘
```

**已停止状态：**
```
┌─────────────────────┐
│ WeRead Auto Pager   │
│                     │
│   [ 已停止 ]        │  红色背景
│    [ 开始 ]         │  绿色按钮
└─────────────────────┘
```

## 项目结构

```
weread-engagement-tools/
├── src/
│   ├── content.ts   # 内容脚本 - 自动点击"下一页" + 行为模拟
│   ├── background.ts # 后台服务
│   └── popup.ts     # 弹出窗口逻辑
├── manifest.json    # 扩展配置
├── popup.html       # 弹出窗口界面
├── build.ts         # Bun 构建脚本
├── package.json
└── README.md
```

## 开发

修改 `src/` 目录中的源代码后，运行 `bun run build` 重新构建。
