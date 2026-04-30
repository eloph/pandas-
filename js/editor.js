// 全局变量
let editor;
let currentDataset = 'sales';
let pyodideInstance = null;
let pythonReady = false;

// 初始化代码编辑器
function initEditor() {
  console.log('初始化代码编辑器...');
  
  const editorElement = document.getElementById('editor');
  if (!editorElement) {
    console.error('找不到编辑器元素');
    return;
  }
  
  // 初始化 CodeMirror
  editor = CodeMirror(editorElement, {
    mode: 'python',
    theme: 'monokai',
    lineNumbers: true,
    indentUnit: 4,
    indentWithTabs: false,
    lineWrapping: true,
    autofocus: false,
    height: '400px',
    viewportMargin: Infinity,
    extraKeys: {
      'Ctrl-Enter': function() { runCode(); },
      'Cmd-Enter': function() { runCode(); },
      'Tab': function(cm) {
        if (cm.somethingSelected()) {
          cm.indentSelection('add');
        } else {
          cm.replaceSelection('    ', 'end');
        }
      }
    }
  });
  
  // 设置默认代码
  const defaultCode = `# 🐼 欢迎使用 Pandas Playground!
# 在下方编写 Pandas 代码，点击"运行代码"按钮执行

import pandas as pd

# 创建示例数据
data = {
    '产品': ['产品A', '产品B', '产品C', '产品D', '产品E'],
    '销售额': [1200, 1800, 1500, 2100, 900],
    '数量': [12, 18, 15, 21, 9]
}

df = pd.DataFrame(data)
print("📊 数据预览:")
print(df)

print("\\n📈 基本统计信息:")
print(df.describe())
`;
  
  editor.setValue(defaultCode);
  
  // 绑定运行按钮
  const runButton = document.querySelector('.run-button');
  if (runButton) {
    runButton.addEventListener('click', runCode);
  }
  
  // 绑定保存按钮
  const saveButton = document.querySelector('.save-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveCode);
  }
  
  // 显示初始提示
  const outputElement = document.querySelector('.editor-output');
  if (outputElement) {
    outputElement.innerHTML = `
      <div style="color: var(--neon-cyan); padding: 20px; text-align: center;">
        <p style="font-size: 24px; margin-bottom: 10px;">🐼</p>
        <p><strong>Python 环境初始化中...</strong></p>
        <p style="font-size: 14px; color: var(--text-secondary);">正在加载 Pandas 库，请稍候</p>
      </div>
    `;
  }
  
  // 初始化 Pyodide
  initPyodide();
}

// 初始化 Pyodide
async function initPyodide() {
  try {
    console.log('正在加载 Pyodide...');
    
    // 检查是否已加载 Pyodide
    if (typeof loadPyodide === 'undefined') {
      throw new Error('Pyodide 脚本未加载');
    }
    
    // 加载 Pyodide
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });
    
    console.log('Pyodide 加载成功，正在加载 Pandas...');
    
    // 加载 pandas 和 numpy
    await pyodideInstance.loadPackage(['pandas', 'numpy', 'matplotlib']);
    
    pythonReady = true;
    console.log('✅ Python 环境就绪!');
    
    // 更新输出区域
    const outputElement = document.querySelector('.editor-output');
    if (outputElement) {
      outputElement.innerHTML = `
        <div style="color: var(--neon-green); padding: 20px; text-align: center;">
          <p style="font-size: 24px; margin-bottom: 10px;">✅</p>
          <p><strong>Python 环境就绪!</strong></p>
          <p style="font-size: 14px; color: var(--text-secondary);">可以开始编写和运行 Pandas 代码了</p>
          <p style="margin-top: 15px; font-size: 12px; color: var(--neon-yellow);">
            💡 提示: 按 Ctrl+Enter (Windows) 或 Cmd+Enter (Mac) 快速运行代码
          </p>
        </div>
      `;
    }
    
    // 添加熊猫动画
    addPandaAnimation();
    
  } catch (error) {
    console.error('❌ Pyodide 加载失败:', error);
    
    const outputElement = document.querySelector('.editor-output');
    if (outputElement) {
      outputElement.innerHTML = `
        <div style="color: var(--neon-orange); padding: 20px; text-align: center;">
          <p style="font-size: 24px; margin-bottom: 10px;">⚠️</p>
          <p><strong>Python 环境加载失败</strong></p>
          <p style="font-size: 14px; color: var(--text-secondary);">将使用模拟模式运行代码</p>
          <p style="font-size: 12px; color: var(--neon-pink);">错误: ${error.message}</p>
        </div>
      `;
    }
    
    pythonReady = false;
  }
}

// 运行代码
async function runCode() {
  if (!editor) {
    showOutput('❌ 编辑器未初始化', 'error');
    return;
  }
  
  const code = editor.getValue();
  
  if (!code.trim()) {
    showOutput('⚠️ 请先输入代码!', 'warning');
    return;
  }
  
  // 显示加载状态
  const outputElement = document.querySelector('.editor-output');
  if (outputElement) {
    outputElement.innerHTML = `
      <div style="padding: 40px; text-align: center;">
        <div style="font-size: 48px; animation: pandaEat 1s ease-in-out infinite;">🐼</div>
        <p style="color: var(--neon-cyan); margin-top: 15px;"><strong>🐍 正在运行 Python 代码...</strong></p>
        <p style="color: var(--text-secondary); font-size: 14px;">请稍候</p>
      </div>
    `;
  }
  
  try {
    let result;
    
    if (pythonReady && pyodideInstance) {
      // 使用 Pyodide 运行真实 Python 代码
      result = await executePythonCode(code);
    } else {
      // 使用模拟模式
      result = simulateCode(code);
    }
    
    // 显示成功结果
    showOutput(result, 'success');
    
    // 显示庆祝动画
    showConfetti();
    showPandaCelebration();
    
  } catch (error) {
    console.error('代码执行错误:', error);
    showOutput('❌ 执行错误:\n\n' + error.message, 'error');
  }
}

// 执行 Python 代码
async function executePythonCode(code) {
  try {
    // 重定向输出
    await pyodideInstance.runPythonAsync(`
import sys
from io import StringIO
import builtins

class OutputCapture:
    def __init__(self):
        self.output = StringIO()
        self.original_stdout = sys.stdout
        self.original_stderr = sys.stderr
        
    def start(self):
        sys.stdout = self.output
        sys.stderr = self.output
        
    def stop(self):
        sys.stdout = self.original_stdout
        sys.stderr = self.original_stderr
        return self.output.getvalue()

capturer = OutputCapture()
capturer.start()
`);
    
    // 执行用户代码
    try {
      await pyodideInstance.runPythonAsync(code);
    } catch (execError) {
      // 获取输出
      const output = pyodideInstance.runPython('capturer.stop()');
      throw new Error(output + '\n\n❌ 代码执行错误:\n' + execError.message);
    }
    
    // 获取输出
    const output = pyodideInstance.runPython('capturer.stop()');
    
    if (!output || output.trim() === '') {
      return '✅ 代码执行完成 (无输出)';
    }
    
    return output;
    
  } catch (error) {
    throw error;
  }
}

// 模拟代码执行
function simulateCode(code) {
  const lines = code.split('\n');
  let output = [];
  let hasDataFrame = false;
  let hasPrint = false;
  
  // 检查代码特征
  if (code.includes('pd.DataFrame') || code.includes('data =')) {
    hasDataFrame = true;
  }
  
  if (code.includes('print(')) {
    hasPrint = true;
  }
  
  // 生成模拟输出
  if (hasDataFrame && hasPrint) {
    if (code.includes('describe()')) {
      output.push('📈 DataFrame 统计描述:');
      output.push('');
      output.push('        销售额         数量');
      output.push('count     5.0          5.0');
      output.push('mean   1500.0         15.0');
      output.push('std     433.0          4.3');
      output.push('min     900.0          9.0');
      output.push('25%    1200.0         12.0');
      output.push('50%    1500.0         15.0');
      output.push('75%    1800.0         18.0');
      output.push('max    2100.0         21.0');
    } else if (code.includes('head()')) {
      output.push('📊 数据预览 (前5行):');
      output.push('');
      output.push('     产品   销售额   数量');
      output.push('0  产品A    1200     12');
      output.push('1  产品B    1800     18');
      output.push('2  产品C    1500     15');
      output.push('3  产品D    2100     21');
      output.push('4  产品E     900      9');
    } else if (code.includes('groupby')) {
      output.push('📦 分组聚合结果:');
      output.push('');
      output.push('     销售额.sum()  数量.sum()');
      output.push('产品                          ');
      output.push('产品A        1200         12');
      output.push('产品B        1800         18');
      output.push('产品C        1500         15');
    } else if (code.includes('sort_values')) {
      output.push('📈 排序结果:');
      output.push('');
      output.push('     产品   销售额   数量');
      output.push('3  产品D    2100     21');
      output.push('1  产品B    1800     18');
      output.push('2  产品C    1500     15');
      output.push('0  产品A    1200     12');
      output.push('4  产品E     900      9');
    } else {
      output.push('📊 数据预览:');
      output.push('');
      output.push('     产品   销售额   数量');
      output.push('0  产品A    1200     12');
      output.push('1  产品B    1800     18');
      output.push('2  产品C    1500     15');
      output.push('3  产品D    2100     21');
      output.push('4  产品E     900      9');
    }
  } else if (hasPrint) {
    // 提取 print 语句中的内容
    const printMatches = code.match(/print\s*\(\s*["']([^"']*)["']\s*\)/g);
    if (printMatches) {
      printMatches.forEach(match => {
        const content = match.match(/print\s*\(\s*["']([^"']*)["']\s*\)/);
        if (content && content[1]) {
          output.push(content[1]);
        }
      });
    }
    
    if (output.length === 0) {
      output.push('✅ 代码执行完成');
    }
  } else {
    output.push('✅ 代码执行完成');
  }
  
  return output.join('\n');
}

// 显示输出结果
function showOutput(content, type) {
  const outputElement = document.querySelector('.editor-output');
  if (!outputElement) return;
  
  let color, borderColor, bgColor;
  
  switch(type) {
    case 'success':
      color = 'var(--neon-cyan)';
      borderColor = 'var(--neon-green)';
      bgColor = 'rgba(57, 255, 20, 0.05)';
      break;
    case 'error':
      color = 'var(--neon-pink)';
      borderColor = 'var(--neon-pink)';
      bgColor = 'rgba(255, 0, 128, 0.05)';
      break;
    case 'warning':
      color = 'var(--neon-orange)';
      borderColor = 'var(--neon-orange)';
      bgColor = 'rgba(255, 102, 0, 0.05)';
      break;
    default:
      color = 'var(--text-primary)';
      borderColor = 'var(--neon-cyan)';
      bgColor = 'var(--dark-tertiary)';
  }
  
  outputElement.innerHTML = `
    <div style="padding: 20px;">
      <div style="color: ${color}; margin-bottom: 15px;">
        <strong>📤 执行结果:</strong>
      </div>
      <pre style="
        background: var(--dark-bg);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid ${borderColor};
        color: ${color};
        font-family: 'Fira Code', 'Consolas', monospace;
        font-size: 14px;
        line-height: 1.6;
        overflow-x: auto;
        max-height: 400px;
        overflow-y: auto;
      ">${escapeHtml(content)}</pre>
      
      ${type === 'success' ? `
      <div style="
        margin-top: 20px;
        padding: 15px;
        background: ${bgColor};
        border: 1px solid ${borderColor};
        border-radius: 8px;
        color: ${borderColor};
        text-align: center;
      ">
        ✅ 代码执行成功!
      </div>
      ` : ''}
    </div>
  `;
}

// HTML 转义
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');
}

// 保存代码
function saveCode() {
  if (!editor) {
    alert('❌ 编辑器未初始化');
    return;
  }
  
  const code = editor.getValue();
  const name = prompt('📝 请输入代码片段名称:', '我的代码');
  
  if (!name) return;
  
  const category = prompt('🏷️ 选择分类:\n1. 数据筛选\n2. 数据分组\n3. 数据清洗\n4. 数据可视化\n5. 其他\n\n请输入数字:', '5');
  
  const categoryNames = {
    '1': '数据筛选',
    '2': '数据分组',
    '3': '数据清洗',
    '4': '数据可视化',
    '5': '其他'
  };
  
  const favorites = JSON.parse(localStorage.getItem('pandasPlayground_favorites') || '[]');
  
  favorites.push({
    id: Date.now().toString(),
    name: name,
    code: code,
    category: categoryNames[category] || '其他',
    createdAt: new Date().toISOString()
  });
  
  localStorage.setItem('pandasPlayground_favorites', JSON.stringify(favorites));
  
  alert('✅ 代码片段已保存到收藏夹!');
}

// 设置当前数据集
function setCurrentDataset(dataset) {
  currentDataset = dataset;
  
  // 更新数据集卡片样式
  document.querySelectorAll('.dataset-card').forEach(card => {
    card.classList.remove('active');
    if (card.onclick && card.onclick.toString().includes(dataset)) {
      card.classList.add('active');
    }
  });
  
  // 更新编辑器代码
  if (editor) {
    const datasetCodes = {
      sales: `# 🐼 销售数据
import pandas as pd

data = {
    '日期': ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'],
    '产品': ['产品A', '产品B', '产品A', '产品C', '产品B'],
    '销售额': [1200, 1800, 1500, 2100, 900],
    '数量': [12, 18, 15, 21, 9]
}

df = pd.DataFrame(data)
print("📊 销售数据预览:")
print(df)

print("\\n📈 统计描述:")
print(df.describe())`,
      
      students: `# 🐼 学生成绩数据
import pandas as pd

data = {
    '学生ID': [1, 2, 3, 4, 5],
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '科目': ['数学', '数学', '语文', '英语', '数学'],
    '成绩': [95, 88, 92, 85, 90]
}

df = pd.DataFrame(data)
print("📊 学生成绩预览:")
print(df)

print("\\n📈 成绩统计:")
print(df.describe())`,
      
      weather: `# 🐼 天气数据
import pandas as pd

data = {
    '日期': ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'],
    '温度': [20, 22, 18, 19, 21],
    '湿度': [60, 55, 65, 62, 58],
    '风速': [5, 3, 4, 2, 3]
}

df = pd.DataFrame(data)
print("📊 天气数据预览:")
print(df)

print("\\n📈 温度统计:")
print(df['温度'].describe())`,
      
      movies: `# 🐼 电影评分数据
import pandas as pd

data = {
    '电影ID': [1, 2, 3, 4, 5],
    '电影名称': ['电影A', '电影B', '电影C', '电影D', '电影E'],
    '评分': [9.2, 8.8, 9.0, 8.5, 8.9],
    '评论数': [10000, 8500, 9200, 7800, 8900]
}

df = pd.DataFrame(data)
print("📊 电影评分预览:")
print(df)

print("\\n📈 评分统计:")
print(df['评分'].describe())`,
      
      employees: `# 🐼 员工信息数据
import pandas as pd

data = {
    '员工ID': [1, 2, 3, 4, 5],
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '部门': ['技术部', '市场部', '技术部', '财务部', '市场部'],
    '薪资': [10000, 8000, 12000, 9000, 8500]
}

df = pd.DataFrame(data)
print("📊 员工信息预览:")
print(df)

print("\\n📈 薪资统计:")
print(df['薪资'].describe())`
    };
    
    const newCode = datasetCodes[dataset] || datasetCodes.sales;
    editor.setValue(newCode);
  }
}

// 插入代码
function insertCode(code) {
  if (!editor) {
    console.error('编辑器未初始化');
    return;
  }
  
  const cursor = editor.getCursor();
  editor.replaceRange('\n' + code, cursor);
  editor.focus();
}

// 添加熊猫动画
function addPandaAnimation() {
  if (document.querySelector('.panda-float')) return;
  
  const panda = document.createElement('div');
  panda.className = 'panda-float';
  panda.textContent = '🐼';
  panda.style.left = (Math.random() * 60 + 20) + '%';
  panda.style.top = (Math.random() * 40 + 30) + '%';
  document.body.appendChild(panda);
  
  setTimeout(() => {
    if (panda.parentNode) {
      panda.remove();
    }
  }, 4000);
}

// 显示熊猫庆祝
function showPandaCelebration() {
  const celebration = document.createElement('div');
  celebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 80px;
    z-index: 10001;
    pointer-events: none;
    animation: celebrationPop 1.5s ease-out forwards;
  `;
  celebration.textContent = '🎉';
  document.body.appendChild(celebration);
  
  setTimeout(() => {
    if (celebration.parentNode) {
      celebration.remove();
    }
  }, 1500);
}

// 显示彩带特效
function showConfetti() {
  const colors = ['#ff0080', '#00ffff', '#ffff00', '#39ff14', '#bf00ff'];
  
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: -20px;
        width: ${Math.random() * 10 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 10000;
        animation: confettiFall ${Math.random() * 2 + 2}s ease-out forwards;
      `;
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, 4000);
    }, Math.random() * 500);
  }
}
