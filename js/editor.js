// 代码编辑器配置

// 全局变量
let editor;
let currentDataset = 'sales';

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
    value: `import pandas as pd

# 加载数据集
df = pd.read_csv('${currentDataset}.csv')

# 查看前5行
print(df.head())
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
}

// 运行代码
async function runCode() {
  const code = editor.getValue();
  const outputElement = document.querySelector('.editor-output');
  
  if (!code) {
    outputElement.innerHTML = '<p>请输入代码后再运行！</p>';
    return;
  }
  
  // 显示加载动画
  const loadingElement = showLoading();
  
  try {
    // 模拟代码执行
    const result = await executeCode(code, currentDataset);
    
    // 显示执行结果
    outputElement.innerHTML = result;
    
    // 显示庆祝特效
    showConfetti();
  } catch (error) {
    outputElement.innerHTML = `<p style="color: red;">错误：${error.message}</p>`;
  } finally {
    // 隐藏加载动画
    hideLoading(loadingElement);
  }
}

// 保存代码
function saveCode() {
  const code = editor.getValue();
  const name = prompt('请输入代码片段名称：');
  
  if (name) {
    saveToFavorites(name, code, '自定义代码');
  }
}

// 模拟代码执行
function executeCode(code, dataset) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 解析代码，模拟执行结果
      let result = '';
      
      // 根据代码内容生成模拟结果
      if (code.includes('df.head()')) {
        result = getDatasetPreview(dataset);
      } else if (code.includes('df.describe()')) {
        result = getDatasetDescription(dataset);
      } else if (code.includes('groupby')) {
        result = getGroupByResult(dataset, code);
      } else if (code.includes('sort_values')) {
        result = getSortResult(dataset, code);
      } else if (code.includes('dropna')) {
        result = getDropNaResult(dataset);
      } else if (code.includes('fillna')) {
        result = getFillNaResult(dataset);
      } else if (code.includes('merge')) {
        result = getMergeResult(code);
      } else if (code.includes('pivot_table')) {
        result = getPivotTableResult(dataset, code);
      } else if (code.includes('plot')) {
        result = getPlotResult(dataset, code);
      } else {
        result = `<p>代码执行成功！</p><p>数据集：${dataset}</p><p>代码：${code}</p>`;
      }
      
      resolve(result);
    }, 1500);
  });
}

// 获取数据集预览
function getDatasetPreview(dataset) {
  const datasets = {
    sales: `
      <h3>销售数据预览</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>产品</th>
            <th>销售额</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2026-01-01</td><td>产品A</td><td>1000</td><td>10</td></tr>
          <tr><td>2026-01-02</td><td>产品B</td><td>1500</td><td>15</td></tr>
          <tr><td>2026-01-03</td><td>产品A</td><td>1200</td><td>12</td></tr>
          <tr><td>2026-01-04</td><td>产品C</td><td>2000</td><td>20</td></tr>
          <tr><td>2026-01-05</td><td>产品B</td><td>1800</td><td>18</td></tr>
        </tbody>
      </table>
    `,
    students: `
      <h3>学生成绩数据预览</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>学生ID</th>
            <th>姓名</th>
            <th>科目</th>
            <th>成绩</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>张三</td><td>数学</td><td>95</td></tr>
          <tr><td>2</td><td>李四</td><td>数学</td><td>88</td></tr>
          <tr><td>3</td><td>王五</td><td>语文</td><td>92</td></tr>
          <tr><td>4</td><td>赵六</td><td>英语</td><td>85</td></tr>
          <tr><td>5</td><td>孙七</td><td>数学</td><td>90</td></tr>
        </tbody>
      </table>
    `,
    weather: `
      <h3>天气数据预览</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>温度</th>
            <th>湿度</th>
            <th>风速</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2026-01-01</td><td>20</td><td>60</td><td>5</td></tr>
          <tr><td>2026-01-02</td><td>22</td><td>55</td><td>3</td></tr>
          <tr><td>2026-01-03</td><td>18</td><td>65</td><td>4</td></tr>
          <tr><td>2026-01-04</td><td>19</td><td>62</td><td>2</td></tr>
          <tr><td>2026-01-05</td><td>21</td><td>58</td><td>3</td></tr>
        </tbody>
      </table>
    `,
    movies: `
      <h3>电影评分数据预览</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>电影ID</th>
            <th>电影名称</th>
            <th>评分</th>
            <th>评论数</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>电影A</td><td>9.2</td><td>10000</td></tr>
          <tr><td>2</td><td>电影B</td><td>8.8</td><td>8500</td></tr>
          <tr><td>3</td><td>电影C</td><td>9.0</td><td>9200</td></tr>
          <tr><td>4</td><td>电影D</td><td>8.5</td><td>7800</td></tr>
          <tr><td>5</td><td>电影E</td><td>8.9</td><td>8900</td></tr>
        </tbody>
      </table>
    `,
    employees: `
      <h3>员工信息数据预览</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>员工ID</th>
            <th>姓名</th>
            <th>部门</th>
            <th>薪资</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>张三</td><td>技术部</td><td>10000</td></tr>
          <tr><td>2</td><td>李四</td><td>市场部</td><td>8000</td></tr>
          <tr><td>3</td><td>王五</td><td>技术部</td><td>12000</td></tr>
          <tr><td>4</td><td>赵六</td><td>财务部</td><td>9000</td></tr>
          <tr><td>5</td><td>孙七</td><td>市场部</td><td>8500</td></tr>
        </tbody>
      </table>
    `
  };
  
  return datasets[dataset] || '<p>数据集不存在</p>';
}

// 获取数据集描述
function getDatasetDescription(dataset) {
  const descriptions = {
    sales: `
      <h3>销售数据描述统计</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>统计量</th>
            <th>销售额</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>均值</td><td>1500</td><td>15</td></tr>
          <tr><td>标准差</td><td>316.23</td><td>3.16</td></tr>
          <tr><td>最小值</td><td>1000</td><td>10</td></tr>
          <tr><td>25%</td><td>1200</td><td>12</td></tr>
          <tr><td>50%</td><td>1500</td><td>15</td></tr>
          <tr><td>75%</td><td>1800</td><td>18</td></tr>
          <tr><td>最大值</td><td>2000</td><td>20</td></tr>
        </tbody>
      </table>
    `,
    students: `
      <h3>学生成绩描述统计</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>统计量</th>
            <th>成绩</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>均值</td><td>90</td></tr>
          <tr><td>标准差</td><td>3.87</td></tr>
          <tr><td>最小值</td><td>85</td></tr>
          <tr><td>25%</td><td>88</td></tr>
          <tr><td>50%</td><td>90</td></tr>
          <tr><td>75%</td><td>92</td></tr>
          <tr><td>最大值</td><td>95</td></tr>
        </tbody>
      </table>
    `,
    weather: `
      <h3>天气数据描述统计</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>统计量</th>
            <th>温度</th>
            <th>湿度</th>
            <th>风速</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>均值</td><td>20</td><td>60</td><td>3.4</td></tr>
          <tr><td>标准差</td><td>1.41</td><td>3.74</td><td>1.14</td></tr>
          <tr><td>最小值</td><td>18</td><td>55</td><td>2</td></tr>
          <tr><td>25%</td><td>19</td><td>58</td><td>3</td></tr>
          <tr><td>50%</td><td>20</td><td>60</td><td>3</td></tr>
          <tr><td>75%</td><td>21</td><td>62</td><td>4</td></tr>
          <tr><td>最大值</td><td>22</td><td>65</td><td>5</td></tr>
        </tbody>
      </table>
    `,
    movies: `
      <h3>电影评分描述统计</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>统计量</th>
            <th>评分</th>
            <th>评论数</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>均值</td><td>8.88</td><td>8880</td></tr>
          <tr><td>标准差</td><td>0.26</td><td>792.46</td></tr>
          <tr><td>最小值</td><td>8.5</td><td>7800</td></tr>
          <tr><td>25%</td><td>8.8</td><td>8500</td></tr>
          <tr><td>50%</td><td>8.9</td><td>8900</td></tr>
          <tr><td>75%</td><td>9.0</td><td>9200</td></tr>
          <tr><td>最大值</td><td>9.2</td><td>10000</td></tr>
        </tbody>
      </table>
    `,
    employees: `
      <h3>员工信息描述统计</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>统计量</th>
            <th>薪资</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>均值</td><td>9500</td></tr>
          <tr><td>标准差</td><td>1581.14</td></tr>
          <tr><td>最小值</td><td>8000</td></tr>
          <tr><td>25%</td><td>8500</td></tr>
          <tr><td>50%</td><td>9000</td></tr>
          <tr><td>75%</td><td>10000</td></tr>
          <tr><td>最大值</td><td>12000</td></tr>
        </tbody>
      </table>
    `
  };
  
  return descriptions[dataset] || '<p>数据集不存在</p>';
}

// 获取分组聚合结果
function getGroupByResult(dataset, code) {
  if (dataset === 'sales') {
    return `
      <h3>按产品分组聚合结果</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>产品</th>
            <th>销售总额</th>
            <th>销售数量</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>产品A</td><td>2200</td><td>22</td></tr>
          <tr><td>产品B</td><td>3300</td><td>33</td></tr>
          <tr><td>产品C</td><td>2000</td><td>20</td></tr>
        </tbody>
      </table>
    `;
  } else if (dataset === 'students') {
    return `
      <h3>按科目分组聚合结果</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>科目</th>
            <th>平均成绩</th>
            <th>成绩总和</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>数学</td><td>91</td><td>273</td></tr>
          <tr><td>语文</td><td>92</td><td>92</td></tr>
          <tr><td>英语</td><td>85</td><td>85</td></tr>
        </tbody>
      </table>
    `;
  }
  return '<p>分组聚合结果</p>';
}

// 获取排序结果
function getSortResult(dataset, code) {
  if (dataset === 'sales') {
    return `
      <h3>按销售额排序结果</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>产品</th>
            <th>销售额</th>
            <th>数量</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>2026-01-04</td><td>产品C</td><td>2000</td><td>20</td></tr>
          <tr><td>2026-01-05</td><td>产品B</td><td>1800</td><td>18</td></tr>
          <tr><td>2026-01-02</td><td>产品B</td><td>1500</td><td>15</td></tr>
          <tr><td>2026-01-03</td><td>产品A</td><td>1200</td><td>12</td></tr>
          <tr><td>2026-01-01</td><td>产品A</td><td>1000</td><td>10</td></tr>
        </tbody>
      </table>
    `;
  }
  return '<p>排序结果</p>';
}

// 获取缺失值处理结果
function getDropNaResult(dataset) {
  return '<p>已删除含有缺失值的行</p>';
}

// 获取填充缺失值结果
function getFillNaResult(dataset) {
  return '<p>已填充缺失值</p>';
}

// 获取合并结果
function getMergeResult(code) {
  return '<p>数据合并成功</p>';
}

// 获取透视表结果
function getPivotTableResult(dataset, code) {
  if (dataset === 'sales') {
    return `
      <h3>销售数据透视表</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>产品</th>
            <th>平均销售额</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>产品A</td><td>1100</td></tr>
          <tr><td>产品B</td><td>1650</td></tr>
          <tr><td>产品C</td><td>2000</td></tr>
        </tbody>
      </table>
    `;
  }
  return '<p>透视表结果</p>';
}

// 获取图表结果
function getPlotResult(dataset, code) {
  return `
    <h3>数据可视化结果</h3>
    <div style="width: 100%; height: 300px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
      <p>图表已生成（模拟）</p>
    </div>
  `;
}

// 设置当前数据集
function setCurrentDataset(dataset) {
  currentDataset = dataset;
  
  // 更新编辑器中的代码
  if (editor) {
    const code = editor.getValue();
    const updatedCode = code.replace(/read_csv\('.*\.csv'\)/, `read_csv('${dataset}.csv')`);
    editor.setValue(updatedCode);
  }
}

// 插入代码到编辑器
function insertCode(code) {
  if (editor) {
    const currentCode = editor.getValue();
    editor.setValue(currentCode + '\n' + code);
  }
}