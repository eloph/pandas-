// 数据集定义和管理

// 内置数据集
const datasets = {
  sales: {
    name: '销售数据',
    description: '包含日期、产品、销售额、数量等字段',
    fields: ['日期', '产品', '销售额', '数量'],
    data: [
      { date: '2026-01-01', product: '产品A', sales: 1000, quantity: 10 },
      { date: '2026-01-02', product: '产品B', sales: 1500, quantity: 15 },
      { date: '2026-01-03', product: '产品A', sales: 1200, quantity: 12 },
      { date: '2026-01-04', product: '产品C', sales: 2000, quantity: 20 },
      { date: '2026-01-05', product: '产品B', sales: 1800, quantity: 18 }
    ]
  },
  students: {
    name: '学生成绩数据',
    description: '包含学生ID、姓名、科目、成绩等字段',
    fields: ['学生ID', '姓名', '科目', '成绩'],
    data: [
      { id: 1, name: '张三', subject: '数学', score: 95 },
      { id: 2, name: '李四', subject: '数学', score: 88 },
      { id: 3, name: '王五', subject: '语文', score: 92 },
      { id: 4, name: '赵六', subject: '英语', score: 85 },
      { id: 5, name: '孙七', subject: '数学', score: 90 }
    ]
  },
  weather: {
    name: '天气数据',
    description: '包含日期、温度、湿度、风速等字段',
    fields: ['日期', '温度', '湿度', '风速'],
    data: [
      { date: '2026-01-01', temperature: 20, humidity: 60, windSpeed: 5 },
      { date: '2026-01-02', temperature: 22, humidity: 55, windSpeed: 3 },
      { date: '2026-01-03', temperature: 18, humidity: 65, windSpeed: 4 },
      { date: '2026-01-04', temperature: 19, humidity: 62, windSpeed: 2 },
      { date: '2026-01-05', temperature: 21, humidity: 58, windSpeed: 3 }
    ]
  },
  movies: {
    name: '电影评分数据',
    description: '包含电影ID、电影名称、评分、评论数等字段',
    fields: ['电影ID', '电影名称', '评分', '评论数'],
    data: [
      { id: 1, name: '电影A', rating: 9.2, comments: 10000 },
      { id: 2, name: '电影B', rating: 8.8, comments: 8500 },
      { id: 3, name: '电影C', rating: 9.0, comments: 9200 },
      { id: 4, name: '电影D', rating: 8.5, comments: 7800 },
      { id: 5, name: '电影E', rating: 8.9, comments: 8900 }
    ]
  },
  employees: {
    name: '员工信息数据',
    description: '包含员工ID、姓名、部门、薪资等字段',
    fields: ['员工ID', '姓名', '部门', '薪资'],
    data: [
      { id: 1, name: '张三', department: '技术部', salary: 10000 },
      { id: 2, name: '李四', department: '市场部', salary: 8000 },
      { id: 3, name: '王五', department: '技术部', salary: 12000 },
      { id: 4, name: '赵六', department: '财务部', salary: 9000 },
      { id: 5, name: '孙七', department: '市场部', salary: 8500 }
    ]
  }
};

// 初始化数据集选择
function initDatasets() {
  const datasetsContainer = document.querySelector('.datasets-grid');
  if (!datasetsContainer) return;
  
  // 渲染数据集卡片
  Object.entries(datasets).forEach(([key, dataset]) => {
    const datasetCard = document.createElement('div');
    datasetCard.className = `dataset-card ${key === 'sales' ? 'active' : ''}`;
    datasetCard.dataset.dataset = key;
    
    datasetCard.innerHTML = `
      <h3 class="dataset-name">${dataset.name}</h3>
      <p class="dataset-description">${dataset.description}</p>
      <div class="dataset-fields">
        <small>字段: ${dataset.fields.join(', ')}</small>
      </div>
    `;
    
    // 点击事件
    datasetCard.addEventListener('click', function() {
      // 移除其他卡片的active类
      document.querySelectorAll('.dataset-card').forEach(card => {
        card.classList.remove('active');
      });
      
      // 添加当前卡片的active类
      this.classList.add('active');
      
      // 设置当前数据集
      setCurrentDataset(key);
    });
    
    datasetsContainer.appendChild(datasetCard);
  });
}

// 获取数据集
function getDataset(key) {
  return datasets[key];
}

// 获取所有数据集
function getAllDatasets() {
  return datasets;
}

// 导出数据集为CSV
function exportDatasetToCSV(datasetKey) {
  const dataset = datasets[datasetKey];
  if (!dataset) return;
  
  // 创建CSV内容
  const headers = dataset.fields.join(',');
  const rows = dataset.data.map(item => {
    return Object.values(item).join(',');
  });
  
  const csvContent = [headers, ...rows].join('\n');
  
  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${datasetKey}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}