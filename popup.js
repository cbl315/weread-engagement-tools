const statusEl = document.getElementById('status');
const toggleBtn = document.getElementById('toggleBtn');

// 更新 UI 状态
function updateUI(isRunning) {
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
function toggleState() {
  chrome.storage.local.get('isRunning', (result) => {
    const newState = !result.isRunning;
    chrome.storage.local.set({ isRunning: newState }, () => {
      updateUI(newState);
    });
  });
}

// 初始化
function init() {
  chrome.storage.local.get('isRunning', (result) => {
    updateUI(result.isRunning || false);
  });
}

toggleBtn.addEventListener('click', toggleState);
init();
