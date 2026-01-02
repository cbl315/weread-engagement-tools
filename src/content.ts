// 状态管理
let isRunning = false;
let timerId: number | null = null;

// 随机间隔函数 (30-75秒)
function randomInterval(): number {
  return Math.floor(Math.random() * (75000 - 30000 + 1)) + 30000;
}

// 查找并点击下一页按钮
function clickNextPageButton(): boolean {
  if (!isRunning) return false;

  // 查找包含"下一页"文字的按钮
  const buttons = document.querySelectorAll('button.renderTarget_pager_button_right');

  for (const button of buttons) {
    if (button.textContent?.includes('下一页')) {
      console.log('[WeRead Auto Pager] Clicking next page button...');
      (button as HTMLButtonElement).click();
      return true;
    }
  }

  console.log('[WeRead Auto Pager] Next page button not found');
  return false;
}

// 调度下一次点击
function scheduleNextClick() {
  if (!isRunning) return;

  const interval = randomInterval();
  console.log(`[WeRead Auto Pager] Next click in ${interval / 1000}s`);

  timerId = window.setTimeout(() => {
    if (isRunning) {
      clickNextPageButton();
      scheduleNextClick();
    }
  }, interval);
}

// 启动自动翻页
function startAutoPager() {
  if (isRunning) return;
  isRunning = true;
  console.log('[WeRead Auto Pager] Started');
  scheduleNextClick();
  updateStorageState();
}

// 停止自动翻页
function stopAutoPager() {
  isRunning = false;
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
  console.log('[WeRead Auto Pager] Stopped');
  updateStorageState();
}

// 更新 storage 状态
function updateStorageState() {
  chrome.storage.local.set({ isRunning });
}

// 从 storage 读取初始状态
async function loadInitialState() {
  const result = await chrome.storage.local.get('isRunning');
  if (result.isRunning === true) {
    startAutoPager();
  }
}

// 监听 storage 变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.isRunning) {
    if (changes.isRunning.newValue === true && !isRunning) {
      startAutoPager();
    } else if (changes.isRunning.newValue === false && isRunning) {
      stopAutoPager();
    }
  }
});

// 页面加载完成后读取状态
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadInitialState);
} else {
  loadInitialState();
}
