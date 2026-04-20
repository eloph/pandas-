// 主逻辑文件

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题
  initTheme();
  
  // 初始化导航栏
  initNavbar();
  
  // 初始化学习进度
  initProgress();
  
  // 初始化代码编辑器（如果在学习页面或挑战页面）
  if (window.location.pathname === '/learn.html' || window.location.pathname === '/challenges.html') {
    initEditor();
  }
  
  // 初始化数据集选择（如果在学习页面）
  if (window.location.pathname === '/learn.html') {
    initDatasets();
    initExamples();
    initCheatsheet();
  }
  
  // 初始化挑战系统（如果在挑战页面）
  if (window.location.pathname === '/challenges.html') {
    initChallenges();
  }
  
  // 初始化数据探索（如果在数据探索页面）
  if (window.location.pathname === '/explore.html') {
    initExplore();
  }
});

// 初始化主题
function initTheme() {
  // 从 localStorage 读取主题偏好
  const savedTheme = localStorage.getItem('pandasPlayground_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
  
  // 主题切换按钮事件
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.body.classList.toggle('dark');
      const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('pandasPlayground_theme', currentTheme);
    });
  }
}

// 初始化导航栏
function initNavbar() {
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarMenu = document.querySelector('.navbar-menu');
  
  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener('click', function() {
      navbarMenu.classList.toggle('active');
    });
  }
}

// 初始化学习进度
function initProgress() {
  // 从 localStorage 读取进度
  const progress = JSON.parse(localStorage.getItem('pandasPlayground_progress') || '{"completedModules": [], "learningDays": 0, "points": 0, "lastVisited": ""}');
  
  // 更新学习天数
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastVisited !== today) {
    progress.learningDays += 1;
    progress.lastVisited = today;
    localStorage.setItem('pandasPlayground_progress', JSON.stringify(progress));
  }
  
  // 更新进度条和显示
  updateProgressDisplay(progress);
}

// 更新进度显示
function updateProgressDisplay(progress) {
  const progressBar = document.querySelector('.progress-bar');
  const learningDaysElement = document.querySelector('.learning-days');
  const pointsElement = document.querySelector('.points');
  
  if (progressBar) {
    // 计算进度百分比（假设总共有10个模块）
    const progressPercent = (progress.completedModules.length / 10) * 100;
    progressBar.style.width = `${Math.min(progressPercent, 100)}%`;
  }
  
  if (learningDaysElement) {
    learningDaysElement.textContent = progress.learningDays;
  }
  
  if (pointsElement) {
    pointsElement.textContent = progress.points;
  }
}

// 初始化代码编辑器
function initEditor() {
  // 这里将在 editor.js 中实现
}

// 初始化数据集选择
function initDatasets() {
  // 这里将在 datasets.js 中实现
}

// 初始化代码示例
function initExamples() {
  // 这里将在 examples.js 中实现
}

// 初始化函数速查表
function initCheatsheet() {
  // 这里将在 cheatsheet.js 中实现
}

// 初始化挑战系统
function initChallenges() {
  // 这里将在 challenges.js 中实现
}

// 初始化数据探索
function initExplore() {
  // 这里将在 explore.js 中实现
}

// 保存学习进度
function saveProgress(moduleName) {
  const progress = JSON.parse(localStorage.getItem('pandasPlayground_progress') || '{"completedModules": [], "learningDays": 0, "points": 0, "lastVisited": ""}');
  
  // 添加完成的模块
  if (!progress.completedModules.includes(moduleName)) {
    progress.completedModules.push(moduleName);
    progress.points += 10; // 每完成一个模块获得10积分
    localStorage.setItem('pandasPlayground_progress', JSON.stringify(progress));
    updateProgressDisplay(progress);
    
    // 显示庆祝特效
    showConfetti();
  }
}

// 显示庆祝特效
function showConfetti() {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDelay = `${Math.random() * 3}s`;
    confetti.style.animationDuration = `${2 + Math.random() * 2}s`;
    
    document.body.appendChild(confetti);
    
    // 3秒后移除
    setTimeout(() => {
      confetti.remove();
    }, 3000);
  }
}

// 加载动画
function showLoading() {
  const loadingHtml = `
    <div class="loading">
      <div class="loading-panda">🐼</div>
    </div>
  `;
  
  // 创建加载元素
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading-overlay';
  loadingElement.style.position = 'fixed';
  loadingElement.style.top = '0';
  loadingElement.style.left = '0';
  loadingElement.style.right = '0';
  loadingElement.style.bottom = '0';
  loadingElement.style.background = 'rgba(255, 255, 255, 0.8)';
  loadingElement.style.display = 'flex';
  loadingElement.style.justifyContent = 'center';
  loadingElement.style.alignItems = 'center';
  loadingElement.style.zIndex = '10000';
  loadingElement.innerHTML = loadingHtml;
  
  document.body.appendChild(loadingElement);
  return loadingElement;
}

// 隐藏加载动画
function hideLoading(loadingElement) {
  if (loadingElement) {
    loadingElement.remove();
  }
}

// 模拟代码执行
function executeCode(code, dataset) {
  // 这里将在 editor.js 中实现
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('代码执行成功！');
    }, 1000);
  });
}

// 保存代码片段到收藏夹
function saveToFavorites(name, code, category) {
  const favorites = JSON.parse(localStorage.getItem('pandasPlayground_favorites') || '[]');
  
  favorites.push({
    id: Date.now().toString(),
    name: name,
    code: code,
    category: category
  });
  
  localStorage.setItem('pandasPlayground_favorites', JSON.stringify(favorites));
  alert('代码片段已保存到收藏夹！');
}

// 获取收藏的代码片段
function getFavorites() {
  return JSON.parse(localStorage.getItem('pandasPlayground_favorites') || '[]');
}

// 移除收藏的代码片段
function removeFromFavorites(id) {
  const favorites = JSON.parse(localStorage.getItem('pandasPlayground_favorites') || '[]');
  const updatedFavorites = favorites.filter(item => item.id !== id);
  localStorage.setItem('pandasPlayground_favorites', JSON.stringify(updatedFavorites));
  alert('代码片段已从收藏夹中移除！');
}