// 状态管理
let isRunning = false;
let timerId: number | null = null;
let behaviorTimerId: number | null = null;

// 随机间隔函数 (20-45秒)
function randomInterval(): number {
  return Math.floor(Math.random() * (45000 - 20000 + 1)) + 20000;
}

// 模拟随机鼠标移动
function simulateMouseMove() {
  const x = Math.floor(Math.random() * window.innerWidth);
  const y = Math.floor(Math.random() * window.innerHeight);

  const event = new MouseEvent('mousemove', {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
    view: window
  });

  document.dispatchEvent(event);
  console.log(`[WeRead Auto Pager] Simulated mouse move to (${x}, ${y})`);
}

// 模拟轻微滚动
function simulateScroll() {
  const scrollDelta = Math.floor(Math.random() * 20) - 10; // -10 到 +10 像素
  window.scrollBy({ top: scrollDelta, behavior: 'instant' });
  console.log(`[WeRead Auto Pager] Simulated scroll: ${scrollDelta}px`);
}

// 随机模拟用户行为
function simulateHumanBehavior() {
  if (!isRunning) return;

  const action = Math.random();

  if (action < 0.7) {
    // 70% 概率鼠标移动
    simulateMouseMove();
  } else if (action < 0.9) {
    // 20% 概率轻微滚动
    simulateScroll();
  }
  // 10% 什么都不做

  // 随机间隔后再次模拟 (2-8秒)
  const nextBehaviorInterval = Math.floor(Math.random() * 6000) + 2000;
  if (isRunning) {
    behaviorTimerId = window.setTimeout(() => {
      simulateHumanBehavior();
    }, nextBehaviorInterval);
  }
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
  clickNextPageButton(); // 启动时立即翻页一次
  scheduleNextClick(); // 然后调度下一次点击
  simulateHumanBehavior(); // 启动行为模拟
  updateStorageState();
}

// 停止自动翻页
function stopAutoPager() {
  isRunning = false;
  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
  if (behaviorTimerId !== null) {
    clearTimeout(behaviorTimerId);
    behaviorTimerId = null;
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
