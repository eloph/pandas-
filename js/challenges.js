// 挑战练习系统

// 挑战题目
const challenges = [
  {
    id: 'challenge1',
    title: '基础数据筛选',
    difficulty: 'easy',
    description: '从销售数据中筛选出销售额大于1500的记录',
    dataset: 'sales',
    input: '销售数据',
    expectedOutput: '销售额大于1500的记录',
    solution: `import pandas as pd

df = pd.read_csv('sales.csv')
filtered_df = df[df['销售额'] > 1500]
print(filtered_df)`,
    hint: '使用布尔索引进行筛选'
  },
  {
    id: 'challenge2',
    title: '数据分组聚合',
    difficulty: 'medium',
    description: '按产品分组，计算每个产品的销售总额和平均销售额',
    dataset: 'sales',
    input: '销售数据',
    expectedOutput: '每个产品的销售总额和平均销售额',
    solution: `import pandas as pd

df = pd.read_csv('sales.csv')
grouped = df.groupby('产品').agg({'销售额': ['sum', 'mean']})
print(grouped)`,
    hint: '使用groupby和agg函数'
  },
  {
    id: 'challenge3',
    title: '数据排序',
    difficulty: 'easy',
    description: '按销售额降序排序，显示前3条记录',
    dataset: 'sales',
    input: '销售数据',
    expectedOutput: '按销售额降序排序的前3条记录',
    solution: `import pandas as pd

df = pd.read_csv('sales.csv')
sorted_df = df.sort_values('销售额', ascending=False).head(3)
print(sorted_df)`,
    hint: '使用sort_values函数和head函数'
  },
  {
    id: 'challenge4',
    title: '缺失值处理',
    difficulty: 'medium',
    description: '处理学生成绩数据中的缺失值，填充为0',
    dataset: 'students',
    input: '学生成绩数据',
    expectedOutput: '填充缺失值后的数据',
    solution: `import pandas as pd

df = pd.read_csv('students.csv')
filled_df = df.fillna(0)
print(filled_df)`,
    hint: '使用fillna函数'
  },
  {
    id: 'challenge5',
    title: '数据透视表',
    difficulty: 'hard',
    description: '创建学生成绩的透视表，按科目统计平均成绩',
    dataset: 'students',
    input: '学生成绩数据',
    expectedOutput: '按科目统计的平均成绩透视表',
    solution: `import pandas as pd

df = pd.read_csv('students.csv')
pivot = pd.pivot_table(df, values='成绩', index='科目', aggfunc='mean')
print(pivot)`,
    hint: '使用pivot_table函数'
  },
  {
    id: 'challenge6',
    title: '新增计算列',
    difficulty: 'medium',
    description: '在销售数据中新增单价列，计算公式为销售额除以数量',
    dataset: 'sales',
    input: '销售数据',
    expectedOutput: '新增单价列后的数据',
    solution: `import pandas as pd

df = pd.read_csv('sales.csv')
df['单价'] = df['销售额'] / df['数量']
print(df)`,
    hint: '直接赋值创建新列'
  },
  {
    id: 'challenge7',
    title: '数据合并',
    difficulty: 'hard',
    description: '合并销售数据和产品数据',
    dataset: 'sales',
    input: '销售数据和产品数据',
    expectedOutput: '合并后的数据',
    solution: `import pandas as pd

sales_df = pd.read_csv('sales.csv')
products_df = pd.read_csv('products.csv')
merged_df = pd.merge(sales_df, products_df, on='产品')
print(merged_df)`,
    hint: '使用merge函数'
  },
  {
    id: 'challenge8',
    title: '统计描述',
    difficulty: 'easy',
    description: '生成销售数据的统计描述',
    dataset: 'sales',
    input: '销售数据',
    expectedOutput: '统计描述结果',
    solution: `import pandas as pd

df = pd.read_csv('sales.csv')
stats = df.describe()
print(stats)`,
    hint: '使用describe函数'
  }
];

// 初始化挑战系统
function initChallenges() {
  const challengesList = document.querySelector('.challenges-list');
  if (!challengesList) return;
  
  // 从localStorage读取挑战完成状态
  const challengeStatus = JSON.parse(localStorage.getItem('pandasPlayground_challenges') || '{}');
  
  // 渲染挑战卡片
  challenges.forEach(challenge => {
    const challengeCard = document.createElement('div');
    challengeCard.className = `challenge-card ${challengeStatus[challenge.id]?.completed ? 'completed' : ''}`;
    challengeCard.dataset.challenge = challenge.id;
    
    challengeCard.innerHTML = `
      <div class="challenge-header">
        <h3 class="challenge-title">${challenge.title}</h3>
        <span class="challenge-difficulty difficulty-${challenge.difficulty}">
          ${challenge.difficulty === 'easy' ? '初级' : challenge.difficulty === 'medium' ? '中级' : '高级'}
        </span>
      </div>
      <p class="challenge-description">${challenge.description}</p>
      <button class="btn btn-primary" onclick="openChallenge('${challenge.id}')">开始挑战</button>
    `;
    
    challengesList.appendChild(challengeCard);
  });
}

// 打开挑战
function openChallenge(challengeId) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;
  
  // 显示挑战详情
  const challengeDetail = document.querySelector('.challenge-detail');
  if (challengeDetail) {
    challengeDetail.innerHTML = `
      <h2>${challenge.title}</h2>
      <div class="challenge-meta">
        <span class="challenge-difficulty difficulty-${challenge.difficulty}">
          ${challenge.difficulty === 'easy' ? '初级' : challenge.difficulty === 'medium' ? '中级' : '高级'}
        </span>
      </div>
      <p class="challenge-description">${challenge.description}</p>
      <div class="challenge-info">
        <p><strong>数据集：</strong>${challenge.dataset}</p>
        <p><strong>输入：</strong>${challenge.input}</p>
        <p><strong>预期输出：</strong>${challenge.expectedOutput}</p>
      </div>
      <div class="challenge-hint">
        <p><strong>提示：</strong>${challenge.hint}</p>
      </div>
      <div class="editor-container">
        <div class="editor-header">
          <h3 class="editor-title">代码编辑器</h3>
          <div class="editor-actions">
            <button class="btn btn-primary run-button">运行代码</button>
            <button class="btn btn-secondary verify-button" onclick="verifyChallenge('${challenge.id}')">验证答案</button>
            <button class="btn btn-outline hint-button" onclick="showHint('${challenge.id}')">查看提示</button>
          </div>
        </div>
        <div id="challenge-editor"></div>
        <div class="editor-output"></div>
      </div>
    `;
    
    // 初始化编辑器
    initChallengeEditor(challenge);
  }
}

// 初始化挑战编辑器
function initChallengeEditor(challenge) {
  // 初始化 CodeMirror
  const editor = CodeMirror(document.getElementById('challenge-editor'), {
    mode: 'python',
    theme: 'monokai',
    lineNumbers: true,
    indentUnit: 4,
    indentWithTabs: false,
    lineWrapping: true,
    autofocus: true,
    value: `import pandas as pd

# 加载数据集
df = pd.read_csv('${challenge.dataset}.csv')

# 编写你的代码
`
  });
  
  // 运行按钮事件
  const runButton = document.querySelector('.run-button');
  if (runButton) {
    runButton.addEventListener('click', function() {
      const code = editor.getValue();
      const outputElement = document.querySelector('.editor-output');
      
      if (!code) {
        outputElement.innerHTML = '<p>请输入代码后再运行！</p>';
        return;
      }
      
      // 显示加载动画
      const loadingElement = showLoading();
      
      setTimeout(() => {
        // 模拟代码执行
        outputElement.innerHTML = '<p>代码执行成功！</p>';
        hideLoading(loadingElement);
      }, 1000);
    });
  }
}

// 验证挑战答案
function verifyChallenge(challengeId) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;
  
  const editor = CodeMirror.fromTextArea(document.getElementById('challenge-editor'));
  const code = editor.getValue();
  const outputElement = document.querySelector('.editor-output');
  
  // 简单验证：检查代码是否包含关键函数
  const hasKeyFunctions = challenge.solution.split('\n').some(line => {
    if (line.trim().startsWith('#') || line.trim() === '') return false;
    return code.includes(line.trim());
  });
  
  if (hasKeyFunctions) {
    // 挑战完成
    const challengeStatus = JSON.parse(localStorage.getItem('pandasPlayground_challenges') || '{}');
    challengeStatus[challengeId] = {
      completed: true,
      attempts: (challengeStatus[challengeId]?.attempts || 0) + 1
    };
    localStorage.setItem('pandasPlayground_challenges', JSON.stringify(challengeStatus));
    
    // 显示成功消息
    outputElement.innerHTML = '<p style="color: green;">挑战成功！恭喜你完成了这个挑战。</p>';
    
    // 显示庆祝特效
    showConfetti();
    
    // 更新挑战卡片状态
    const challengeCard = document.querySelector(`.challenge-card[data-challenge="${challengeId}"]`);
    if (challengeCard) {
      challengeCard.classList.add('completed');
    }
  } else {
    // 挑战失败
    outputElement.innerHTML = '<p style="color: red;">挑战失败，请再试一次！</p>';
  }
}

// 显示提示
function showHint(challengeId) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;
  
  alert(`提示：${challenge.hint}`);
}

// 显示参考答案
function showSolution(challengeId) {
  const challenge = challenges.find(c => c.id === challengeId);
  if (!challenge) return;
  
  alert(`参考答案：\n${challenge.solution}`);
}

// 获取挑战完成状态
function getChallengeStatus() {
  return JSON.parse(localStorage.getItem('pandasPlayground_challenges') || '{}');
}

// 重置挑战进度
function resetChallenges() {
  if (confirm('确定要重置所有挑战进度吗？')) {
    localStorage.removeItem('pandasPlayground_challenges');
    location.reload();
  }
}