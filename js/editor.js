// 代码编辑器配置

// 全局变量
let editor;
let currentDataset = 'sales';
let pyodide = null;
let isPyodideLoaded = false;

// 初始化编辑器
function initEditor() {
  // 初始化 CodeMirror
  editor = CodeMirror(document.getElementById('editor'), {
    mode: 'python',
    theme: 'monokai',
    lineNumbers: true,
    indentUnit: 4,
    indentWithTabs: false,
    lineWrapping: true,
    autofocus: true,
    extraKeys: {
      'Ctrl-Enter': runCode,
      'Cmd-Enter': runCode
    },
    value: `# 🐼 欢迎使用 Pandas Playground!
# 在下方编写你的 Pandas 代码，点击运行按钮执行

import pandas as pd
import numpy as np

# 创建示例数据
data = {
    '产品': ['产品A', '产品B', '产品C', '产品D', '产品E'],
    '销售额': [1200, 1800, 1500, 2100, 900],
    '数量': [12, 18, 15, 21, 9]
}

df = pd.DataFrame(data)
print("📊 数据预览:")
print(df)

print("\\n📈 基本统计:")
print(df.describe())
`
  });

  // 运行按钮事件
  const runButton = document.querySelector('.run-button');
  if (runButton) {
    runButton.addEventListener('click', runCode);
  }

  // 保存按钮事件
  const saveButton = document.querySelector('.save-button');
  if (saveButton) {
    saveButton.addEventListener('click', saveCode);
  }

  // 加载 Pyodide
  loadPyodideEngine();
}

// 加载 Pyodide 引擎
async function loadPyodideEngine() {
  const outputElement = document.querySelector('.editor-output');
  outputElement.innerHTML = `
    <div class="loading">
      <div class="loading-panda">🐼</div>
      <p class="loading-text">正在加载 Python 引擎...</p>
    </div>
  `;

  try {
    // 加载 Pyodide
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    });

    // 加载 pandas 和 numpy
    await pyodide.loadPackage(['pandas', 'numpy']);

    isPyodideLoaded = true;
    outputElement.innerHTML = `
      <div style="color: var(--neon-green); padding: 20px;">
        <p>✅ <strong>Python 环境已就绪!</strong></p>
        <p>你可以开始编写和运行 Pandas 代码了。</p>
        <p style="margin-top: 10px; color: var(--neon-cyan);">
          💡 提示: 按 Ctrl+Enter (Windows) 或 Cmd+Enter (Mac) 可以快速运行代码
        </p>
      </div>
    `;

    // 添加熊猫浮动动画
    addPandaAnimation();
  } catch (error) {
    console.error('Pyodide 加载失败:', error);
    outputElement.innerHTML = `
      <div style="color: var(--neon-pink); padding: 20px;">
        <p>⚠️ Python 引擎加载失败</p>
        <p>将使用模拟模式运行代码</p>
      </div>
    `;
    isPyodideLoaded = false;
  }
}

// 运行代码
async function runCode() {
  const code = editor.getValue();
  const outputElement = document.querySelector('.editor-output');

  if (!code) {
    outputElement.innerHTML = '<p style="color: var(--neon-orange);">⚠️ 请先输入代码!</p>';
    return;
  }

  // 显示加载动画
  outputElement.innerHTML = `
    <div class="loading">
      <div class="loading-panda">🐼</div>
      <p class="loading-text">🐍 正在运行 Python 代码...</p>
    </div>
  `;

  try {
    let result;

    if (isPyodideLoaded && pyodide) {
      // 使用 Pyodide 运行真实 Python 代码
      result = await runPythonCode(code);
    } else {
      // 使用模拟模式
      result = simulateCodeExecution(code);
    }

    // 显示结果
    outputElement.innerHTML = `
      <h3 style="color: var(--neon-green); margin-bottom: 15px;">📤 执行结果:</h3>
      <pre style="background: var(--dark-bg); padding: 20px; border-radius: 8px; overflow-x: auto; color: var(--neon-cyan); font-family: 'Fira Code', monospace;">${escapeHtml(result)}</pre>
      <div style="margin-top: 20px; padding: 15px; background: rgba(57, 255, 20, 0.1); border: 1px solid var(--neon-green); border-radius: 8px; color: var(--neon-green);">
        ✅ 代码执行成功!
      </div>
    `;

    // 显示庆祝特效
    showConfetti();
    showPandaCelebration();
  } catch (error) {
    console.error('代码执行错误:', error);
    outputElement.innerHTML = `
      <h3 style="color: var(--neon-pink); margin-bottom: 15px;">❌ 执行错误:</h3>
      <pre style="background: var(--dark-bg); padding: 20px; border-radius: 8px; overflow-x: auto; color: var(--neon-pink); font-family: 'Fira Code', monospace;">${escapeHtml(error.message)}</pre>
    `;
  }
}

// 使用 Pyodide 运行 Python 代码
async function runPythonCode(code) {
  try {
    // 设置输出捕获
    let output = '';

    // 运行代码
    pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

    await pyodide.runPythonAsync(code);

    // 获取输出
    const stdout = pyodide.runPython('sys.stdout.getvalue()');
    const stderr = pyodide.runPython('sys.stderr.getvalue()');

    if (stderr) {
      throw new Error(stderr);
    }

    output = stdout;

    // 恢复标准输出
    pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

    return output || '代码执行完成，无输出';
  } catch (error) {
    throw error;
  }
}

// 模拟代码执行
function simulateCodeExecution(code) {
  let output = '';

  if (code.includes('print(')) {
    if (code.includes('df.head()')) {
      output = generateDataPreview();
    } else if (code.includes('df.describe()')) {
      output = generateDataDescription();
    } else if (code.includes('groupby')) {
      output = generateGroupByResult();
    } else if (code.includes('sort_values')) {
      output = generateSortResult();
    } else if (code.includes('pivot_table')) {
      output = generatePivotTable();
    } else if (code.includes('merge')) {
      output = '数据合并操作完成\n成功合并 2 个数据集';
    } else if (code.includes('dropna') || code.includes('fillna')) {
      output = '数据清洗操作完成\n已处理缺失值';
    } else {
      output = simulatePrintStatements(code);
    }
  } else {
    output = '代码执行完成 (无输出)';
  }

  return output;
}

// 模拟 print 语句
function simulatePrintStatements(code) {
  const printMatches = code.match(/print\(['"](.*?)['"]\)/g);
  if (printMatches) {
    return printMatches.map(m => {
      const content = m.match(/print\(['"](.*?)['"]\)/)[1];
      return content;
    }).join('\n');
  }
  return '代码执行完成';
}

// 生成数据预览
function generateDataPreview() {
  return `     产品   销售额   数量
0  产品A    1200     12
1  产品B    1800     18
2  产品C    1500     15
3  产品D    2100     21
4  产品E     900      9`;
}

// 生成数据描述
function generateDataDescription() {
  return `           销售额         数量
count     5.0          5.0
mean   1500.0         15.0
std     433.0          4.3
min     900.0          9.0
25%    1200.0         12.0
50%    1500.0         15.0
75%    1800.0         18.0
max    2100.0         21.0`;
}

// 生成分组结果
function generateGroupByResult() {
  return `        销售额总额   平均销售额
产品                         
产品A        2400      1200.0
产品B        1800      1800.0
产品C        1500      1500.0`;
}

// 生成排序结果
function generateSortResult() {
  return `     产品   销售额   数量
3  产品D    2100     21
1  产品B    1800     18
2  产品C    1500     15
0  产品A    1200     12
4  产品E     900      9`;
}

// 生成透视表
function generatePivotTable() {
  return `        平均销售额
产品              
产品A        1200.0
产品B        1800.0
产品C        1500.0`;
}

// HTML 转义
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 保存代码
function saveCode() {
  const code = editor.getValue();
  const name = prompt('📝 请输入代码片段名称：', '我的代码片段');

  if (name) {
    const category = prompt('🏷️ 请选择分类：\n1. 数据筛选\n2. 数据分组\n3. 数据清洗\n4. 数据可视化\n5. 其他', '5');

    const categoryNames = {
      '1': '数据筛选',
      '2': '数据分组',
      '3': '数据清洗',
      '4': '数据可视化',
      '5': '其他'
    };

    saveToFavorites(name, code, categoryNames[category] || '其他');
  }
}

// 设置当前数据集
function setCurrentDataset(dataset) {
  currentDataset = dataset;

  // 更新编辑器中的代码
  if (editor) {
    const datasetTemplates = {
      sales: `data = {
    '日期': ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'],
    '产品': ['产品A', '产品B', '产品A', '产品C', '产品B'],
    '销售额': [1200, 1800, 1500, 2100, 900],
    '数量': [12, 18, 15, 21, 9]
}
df = pd.DataFrame(data)`,
      students: `data = {
    '学生ID': [1, 2, 3, 4, 5],
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '科目': ['数学', '数学', '语文', '英语', '数学'],
    '成绩': [95, 88, 92, 85, 90]
}
df = pd.DataFrame(data)`,
      weather: `data = {
    '日期': ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04', '2026-01-05'],
    '温度': [20, 22, 18, 19, 21],
    '湿度': [60, 55, 65, 62, 58],
    '风速': [5, 3, 4, 2, 3]
}
df = pd.DataFrame(data)`,
      movies: `data = {
    '电影ID': [1, 2, 3, 4, 5],
    '电影名称': ['电影A', '电影B', '电影C', '电影D', '电影E'],
    '评分': [9.2, 8.8, 9.0, 8.5, 8.9],
    '评论数': [10000, 8500, 9200, 7800, 8900]
}
df = pd.DataFrame(data)`,
      employees: `data = {
    '员工ID': [1, 2, 3, 4, 5],
    '姓名': ['张三', '李四', '王五', '赵六', '孙七'],
    '部门': ['技术部', '市场部', '技术部', '财务部', '市场部'],
    '薪资': [10000, 8000, 12000, 9000, 8500]
}
df = pd.DataFrame(data)`
    };

    const templateCode = datasetTemplates[dataset] || datasetTemplates.sales;
    const newCode = `# 🐼 数据集: ${dataset}
${templateCode}

print("📊 数据预览:")
print(df)`;

    editor.setValue(newCode);
  }
}

// 插入代码到编辑器
function insertCode(code) {
  if (editor) {
    const currentCode = editor.getValue();
    const cursorPos = editor.getCursor();
    editor.replaceRange('\n' + code, cursorPos);
  }
}

// 添加熊猫动画
function addPandaAnimation() {
  if (document.querySelector('.panda-float')) return;

  const panda = document.createElement('div');
  panda.className = 'panda-float';
  panda.textContent = '🐼';
  panda.style.left = Math.random() * 80 + 10 + '%';
  panda.style.top = Math.random() * 60 + 20 + '%';
  document.body.appendChild(panda);

  // 5秒后移除
  setTimeout(() => {
    panda.remove();
  }, 5000);
}

// 显示熊猫庆祝
function showPandaCelebration() {
  const pandascelebration = document.createElement('div');
  pandascelebration.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 100px;
    animation: pandaBounce 1s ease-in-out;
    z-index: 10001;
    pointer-events: none;
  `;
  pandascelebration.textContent = '🎉🐼🎉';
  document.body.appendChild(pandascelebration);

  setTimeout(() => {
    pandascelebration.remove();
  }, 1500);
}
