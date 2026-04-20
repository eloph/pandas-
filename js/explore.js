// 数据探索功能

// 初始化数据探索
function initExplore() {
  const uploadArea = document.querySelector('.upload-area');
  const fileInput = document.querySelector('#csv-file');
  
  if (!uploadArea || !fileInput) return;
  
  // 拖放功能
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    this.classList.remove('dragover');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });
  
  // 文件选择功能
  fileInput.addEventListener('change', function() {
    if (this.files.length) {
      handleFile(this.files[0]);
    }
  });
  
  // 点击上传区域触发文件选择
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });
}

// 处理文件上传
function handleFile(file) {
  if (!file.name.endsWith('.csv')) {
    alert('请上传 CSV 文件！');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const csvData = e.target.result;
    parseCSV(csvData);
  };
  reader.readAsText(file);
}

// 解析 CSV 数据
function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    data.push(row);
  }
  
  // 显示数据预览
  showDataPreview(headers, data);
  
  // 生成分析报告
  generateAnalysisReport(headers, data);
  
  // 生成代码建议
  generateCodeSuggestions(headers, data);
}

// 显示数据预览
function showDataPreview(headers, data) {
  const dataPreview = document.querySelector('.data-preview');
  if (!dataPreview) return;
  
  // 渲染表格
  let tableHtml = `
    <h3>数据预览</h3>
    <table class="data-table">
      <thead>
        <tr>
          ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.slice(0, 10).map(row => `
          <tr>
            ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p class="text-sm text-gray-500">显示前 10 条记录，共 ${data.length} 条</p>
  `;
  
  dataPreview.innerHTML = tableHtml;
}

// 生成分析报告
function generateAnalysisReport(headers, data) {
  const analysisReport = document.querySelector('.analysis-report');
  if (!analysisReport) return;
  
  // 基本信息
  const info = {
    totalRows: data.length,
    totalColumns: headers.length,
    columns: headers
  };
  
  // 数据类型分析
  const columnTypes = {};
  headers.forEach(header => {
    const values = data.map(row => row[header]).filter(val => val !== '');
    if (values.length === 0) {
      columnTypes[header] = '空列';
    } else if (values.every(val => !isNaN(parseFloat(val)))) {
      columnTypes[header] = '数值型';
    } else if (values.every(val => !isNaN(Date.parse(val)))) {
      columnTypes[header] = '日期型';
    } else {
      columnTypes[header] = '文本型';
    }
  });
  
  // 数值型列的统计信息
  const stats = {};
  headers.forEach(header => {
    if (columnTypes[header] === '数值型') {
      const values = data.map(row => parseFloat(row[header])).filter(val => !isNaN(val));
      if (values.length > 0) {
        stats[header] = {
          mean: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    }
  });
  
  // 渲染分析报告
  let reportHtml = `
    <h3>数据分析报告</h3>
    <div class="card">
      <h4>基本信息</h4>
      <ul>
        <li>总记录数：${info.totalRows}</li>
        <li>总列数：${info.totalColumns}</li>
        <li>列名：${info.columns.join(', ')}</li>
      </ul>
    </div>
    <div class="card">
      <h4>数据类型分析</h4>
      <ul>
        ${Object.entries(columnTypes).map(([column, type]) => `<li>${column}：${type}</li>`).join('')}
      </ul>
    </div>
  `;
  
  // 添加统计信息
  if (Object.keys(stats).length > 0) {
    reportHtml += `
      <div class="card">
        <h4>数值型列统计</h4>
        <table class="data-table">
          <thead>
            <tr>
              <th>列名</th>
              <th>均值</th>
              <th>最小值</th>
              <th>最大值</th>
              <th>有效数据量</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(stats).map(([column, stat]) => `
              <tr>
                <td>${column}</td>
                <td>${stat.mean}</td>
                <td>${stat.min}</td>
                <td>${stat.max}</td>
                <td>${stat.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
  
  analysisReport.innerHTML = reportHtml;
}

// 生成代码建议
function generateCodeSuggestions(headers, data) {
  const codeSuggestions = document.querySelector('.code-suggestions');
  if (!codeSuggestions) return;
  
  // 生成基本代码
  const baseCode = `import pandas as pd

# 读取 CSV 文件
df = pd.read_csv('your_file.csv')

# 查看数据基本信息
print(df.info())

# 查看前 5 行数据
print(df.head())`;
  
  // 生成数据清洗代码
  const cleaningCode = `# 处理缺失值
# 检查缺失值
print(df.isnull().sum())

# 删除含有缺失值的行
# df = df.dropna()

# 填充缺失值
# df = df.fillna(0)`;
  
  // 生成数据分析代码
  let analysisCode = `# 数据分析
`;
  
  // 为数值型列添加统计代码
  headers.forEach(header => {
    analysisCode += `# 统计 ${header} 列
# print(df['${header}'].describe())
`;
  });
  
  // 生成可视化代码
  let visualizationCode = `# 数据可视化
import matplotlib.pyplot as plt

`;
  
  // 为数值型列添加可视化代码
  headers.forEach(header => {
    visualizationCode += `# 绘制 ${header} 列的直方图
# df['${header}'].hist()
# plt.title('${header} 分布')
# plt.show()

`;
  });
  
  // 渲染代码建议
  let suggestionsHtml = `
    <h3>代码建议</h3>
    <div class="card">
      <h4>基本操作</h4>
      <pre class="example-code">${baseCode}</pre>
    </div>
    <div class="card">
      <h4>数据清洗</h4>
      <pre class="example-code">${cleaningCode}</pre>
    </div>
    <div class="card">
      <h4>数据分析</h4>
      <pre class="example-code">${analysisCode}</pre>
    </div>
    <div class="card">
      <h4>数据可视化</h4>
      <pre class="example-code">${visualizationCode}</pre>
    </div>
  `;
  
  codeSuggestions.innerHTML = suggestionsHtml;
}

// 下载分析报告
function downloadAnalysisReport() {
  const analysisReport = document.querySelector('.analysis-report');
  if (!analysisReport) return;
  
  const reportContent = analysisReport.innerHTML;
  const blob = new Blob([reportContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'analysis-report.html';
  link.click();
  URL.revokeObjectURL(url);
}

// 下载代码建议
function downloadCodeSuggestions() {
  const codeSuggestions = document.querySelector('.code-suggestions');
  if (!codeSuggestions) return;
  
  // 提取代码内容
  const codeBlocks = codeSuggestions.querySelectorAll('.example-code');
  let codeContent = '';
  
  codeBlocks.forEach((block, index) => {
    codeContent += `# 代码建议 ${index + 1}\n`;
    codeContent += block.textContent + '\n\n';
  });
  
  const blob = new Blob([codeContent], { type: 'text/python' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'pandas-code-suggestions.py';
  link.click();
  URL.revokeObjectURL(url);
}