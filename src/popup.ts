const statusEl = document.getElementById('status') as HTMLElement;
const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;

// 更新 UI 状态
function updateUI(isRunning: boolean) {
  if (isRunning) {
    statusEl.textContent = '运行中';
    statusEl.className = 'status running';
    toggleBtn.textContent = '暂停';
    toggleBtn.className = 'stop';
  } else {
    statusEl.textContent = '已停止';
    statusEl.className = 'status stopped';
    toggleBtn.textContent = '开始';
    toggleBtn.className = '';
  }
}

// 切换状态
async function toggleState() {
  const result = await chrome.storage.local.get('isRunning');
  const newState = !result.isRunning;
  await chrome.storage.local.set({ isRunning: newState });
  updateUI(newState);
}

// 初始化
async function init() {
  const result = await chrome.storage.local.get('isRunning');
  updateUI(result.isRunning || false);
}

toggleBtn.addEventListener('click', toggleState);
init();
