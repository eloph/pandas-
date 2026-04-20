// 代码示例库

// 代码示例分类
const exampleCategories = {
  basics: '基础操作',
  filtering: '数据筛选',
  grouping: '数据分组',
  merging: '数据合并',
  pivoting: '数据透视表',
  cleaning: '数据清洗',
  sorting: '数据排序',
  visualization: '数据可视化',
  statistics: '统计描述',
  advanced: '高级操作'
};

// 代码示例
const codeExamples = [
  {
    id: '1',
    title: '读取CSV文件',
    category: 'basics',
    code: `import pandas as pd

# 读取CSV文件
df = pd.read_csv('sales.csv')

# 查看数据
df.head()`
  },
  {
    id: '2',
    title: '布尔索引筛选',
    category: 'filtering',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 筛选销售额大于1000的数据
filtered_df = df[df['销售额'] > 1000]

print(filtered_df)`
  },
  {
    id: '3',
    title: '按产品分组聚合',
    category: 'grouping',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 按产品分组，计算销售总额和平均销售额
grouped_df = df.groupby('产品').agg({
    '销售额': ['sum', 'mean'],
    '数量': 'sum'
})

print(grouped_df)`
  },
  {
    id: '4',
    title: '合并两个数据集',
    category: 'merging',
    code: `import pandas as pd

# 读取两个数据集
df1 = pd.read_csv('sales.csv')
df2 = pd.read_csv('products.csv')

# 按产品名称合并
merged_df = pd.merge(df1, df2, on='产品')

print(merged_df)`
  },
  {
    id: '5',
    title: '创建数据透视表',
    category: 'pivoting',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 创建数据透视表，按产品和日期统计销售额
pivot_table = pd.pivot_table(df, values='销售额', index='产品', columns='日期', aggfunc='sum')

print(pivot_table)`
  },
  {
    id: '6',
    title: '处理缺失值',
    category: 'cleaning',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 检查缺失值
print(df.isnull().sum())

# 删除含有缺失值的行
clean_df = df.dropna()

# 或者填充缺失值
filled_df = df.fillna(0)

print(clean_df)`
  },
  {
    id: '7',
    title: '数据排序',
    category: 'sorting',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 按销售额降序排序
sorted_df = df.sort_values('销售额', ascending=False)

print(sorted_df)`
  },
  {
    id: '8',
    title: '新增计算列',
    category: 'advanced',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 新增单价列
df['单价'] = df['销售额'] / df['数量']

print(df)`
  },
  {
    id: '9',
    title: '数据可视化',
    category: 'visualization',
    code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('sales.csv')

# 绘制销售额折线图
df.plot(x='日期', y='销售额', kind='line')
plt.title('销售趋势')
plt.show()`
  },
  {
    id: '10',
    title: '统计描述',
    category: 'statistics',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 生成统计描述
stats = df.describe()

print(stats)`
  },
  {
    id: '11',
    title: '数据转置',
    category: 'advanced',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 转置数据
transposed_df = df.T

print(transposed_df)`
  },
  {
    id: '12',
    title: '应用自定义函数',
    category: 'advanced',
    code: `import pandas as pd

df = pd.read_csv('sales.csv')

# 定义自定义函数
def categorize_sales(amount):
    if amount > 1500:
        return '高销售'
    else:
        return '低销售'

# 应用函数到销售额列
df['销售类别'] = df['销售额'].apply(categorize_sales)

print(df)`
  }
];

// 初始化代码示例
function initExamples() {
  const examplesTabs = document.querySelector('.examples-tabs');
  const examplesList = document.querySelector('.examples-list');
  
  if (!examplesTabs || !examplesList) return;
  
  // 渲染分类标签
  Object.entries(exampleCategories).forEach(([key, name]) => {
    const tab = document.createElement('button');
    tab.className = `example-tab ${key === 'basics' ? 'active' : ''}`;
    tab.dataset.category = key;
    tab.textContent = name;
    
    tab.addEventListener('click', function() {
      // 移除其他标签的active类
      document.querySelectorAll('.example-tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // 添加当前标签的active类
      this.classList.add('active');
      
      // 过滤并显示对应分类的示例
      filterExamples(key);
    });
    
    examplesTabs.appendChild(tab);
  });
  
  // 初始显示基础操作分类的示例
  filterExamples('basics');
}

// 过滤显示代码示例
function filterExamples(category) {
  const examplesList = document.querySelector('.examples-list');
  if (!examplesList) return;
  
  // 清空列表
  examplesList.innerHTML = '';
  
  // 过滤示例
  const filteredExamples = codeExamples.filter(example => example.category === category);
  
  // 渲染示例
  filteredExamples.forEach(example => {
    const exampleItem = document.createElement('div');
    exampleItem.className = 'example-item';
    
    exampleItem.innerHTML = `
      <h3 class="example-title">${example.title}</h3>
      <pre class="example-code">${example.code}</pre>
      <button class="btn btn-primary btn-sm" onclick="insertCode('${example.code.replace(/\n/g, '\\n')}')">插入代码</button>
    `;
    
    examplesList.appendChild(exampleItem);
  });
}

// 搜索代码示例
function searchExamples(query) {
  const examplesList = document.querySelector('.examples-list');
  if (!examplesList) return;
  
  // 清空列表
  examplesList.innerHTML = '';
  
  // 搜索示例
  const searchResults = codeExamples.filter(example => 
    example.title.toLowerCase().includes(query.toLowerCase()) ||
    example.code.toLowerCase().includes(query.toLowerCase())
  );
  
  // 渲染搜索结果
  searchResults.forEach(example => {
    const exampleItem = document.createElement('div');
    exampleItem.className = 'example-item';
    
    exampleItem.innerHTML = `
      <h3 class="example-title">${example.title}</h3>
      <pre class="example-code">${example.code}</pre>
      <button class="btn btn-primary btn-sm" onclick="insertCode('${example.code.replace(/\n/g, '\\n')}')">插入代码</button>
    `;
    
    examplesList.appendChild(exampleItem);
  });
}