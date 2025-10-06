export default {
  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    filter: '筛选',
    reset: '重置',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    close: '关闭',
    open: '打开',
    upload: '上传',
    download: '下载',
    export: '导出',
    import: '导入',
    refresh: '刷新',
    retry: '重试'
  },

  // 导航栏
  navigation: {
    home: '首页',
    aboutUs: '关于我们',
    coreValues: '核心价值观',
    products: '我们的产品',
    riskManagement: '风险管理',
    partners: '合作伙伴',
    contactUs: '联系我们',
    login: '登录',
    language: '语言'
  },

  // 首页
  home: {
    title: 'Unleash growth with diverse strategies',
    subtitle: '',
    learnMore: '了解更多',
    viewCharts: '查看图表',
    fetchMarketData: '获取市场数据',
    marketDataCharts: '市场数据图表',
    apiError: 'API错误',
    noDataAvailable: '暂无数据',
    dataPoints: '数据点',
    dateRange: '日期范围',
    volume: '成交量',
    open: '开盘价',
    high: '最高价',
    low: '最低价',
    close: '收盘价',
    vwap: '成交量加权平均价',
    aboutDescription: '我们是一家专注于量化金融技术的创新公司，致力于为投资者提供最先进的数据分析和交易解决方案。',
    feature1: {
      title: '实时数据',
      description: '提供毫秒级的市场数据更新，确保您获得最新的市场信息。'
    },
    feature2: {
      title: '智能分析',
      description: '基于机器学习的智能分析算法，帮助您发现市场机会。'
    },
    feature3: {
      title: '风险控制',
      description: '完善的风险管理体系，保护您的投资安全。'
    },
    value1: {
      title: '专业',
      description: '我们拥有专业的金融和技术团队，为您提供最专业的服务。'
    },
    value2: {
      title: '创新',
      description: '持续创新，不断推出新的产品和服务，满足市场需求。'
    },
    value3: {
      title: '可靠',
      description: '稳定的系统架构，7x24小时不间断服务，确保您的业务连续性。'
    },
    product1: {
      title: '量化交易系统',
      description: '基于先进算法的量化交易系统，帮助您实现自动化交易。',
      feature1: '多策略支持',
      feature2: '实时风控',
      feature3: '回测分析'
    },
    product2: {
      title: '数据分析平台',
      description: '强大的数据分析平台，提供全面的市场洞察。',
      feature1: '多维度分析',
      feature2: '可视化图表',
      feature3: '自定义指标'
    },
    product3: {
      title: 'AI智能助手',
      description: '基于人工智能的智能助手，为您提供个性化的投资建议。',
      feature1: '智能推荐',
      feature2: '风险预警',
      feature3: '个性化服务'
    },
    risk1: {
      title: '市场风险',
      description: '通过多元化投资组合和动态对冲策略，有效控制市场风险。'
    },
    risk2: {
      title: '技术风险',
      description: '采用先进的技术架构和多重备份机制，确保系统稳定运行。'
    },
    risk3: {
      title: '合规风险',
      description: '严格遵守相关法规，建立完善的合规管理体系。'
    },
    partner1: {
      name: '知名银行',
      description: '与多家知名银行建立战略合作关系，提供资金托管服务。'
    },
    partner2: {
      name: '证券公司',
      description: '与顶级证券公司合作，提供专业的交易执行服务。'
    },
    partner3: {
      name: '技术公司',
      description: '与领先的技术公司合作，共同开发创新产品。'
    },
    contactInfo: {
      title: '联系信息',
      email: '邮箱',
      phone: '电话',
      address: '地址',
      addressText: '北京市朝阳区金融街88号'
    },
    contactForm: {
      title: '联系我们',
      name: '姓名',
      email: '邮箱',
      message: '留言内容',
      submit: '发送消息',
      successMessage: '消息发送成功！我们会尽快回复您。'
    }
  },

  // 图表页面
  charts: {
    title: 'CSV数据可视化图表',
    uploadSection: '上传CSV文件',
    uploadHint: '请选择要上传的CSV文件',
    fileRequirements: '文件要求：',
    supportedFormats: '支持的日期格式：',
    supportedColumns: '支持的列名：',
    csvOnly: '仅支持CSV文件',
    firstColumnDate: '第一列：日期（支持多种格式）',
    secondColumnValue: '第二列：数值',
    autoDetect: '列名自动检测',
    dateFormats: [
      'YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY',
      'YYYY/MM/DD, MM/DD/YY',
      'YYYY-MM-DD HH:MM:SS'
    ],
    columnNames: {
      date: '日期：date, time, timestamp, day, month, year, 日期, 时间等',
      value: '数值：value, price, amount, quantity, count, number, 数值, 价格等'
    },
    noDataMessage: '暂无数据。请在上方上传CSV文件。',
    totalDataPoints: '总数据点',
    dataTrendChart: '数据趋势图表',
    value: '数值',
    selectCsvFile: '请仅选择CSV文件。',
    errorParsingCsv: '解析CSV文件时出错',
    errorReadingCsv: '读取CSV文件时出错',
    csvEmpty: 'CSV文件为空或无效',
    csvMinColumns: 'CSV文件必须至少包含2列',
    cannotIdentifyColumns: '无法识别CSV文件中的日期和数值列',
    invalidDateFormat: '第{row}行日期格式无效："{date}"。期望格式：YYYY-MM-DD',
    invalidValue: '第{row}行数值无效："{value}"。必须是数字'
  },

  // 市场数据
  marketData: {
    sp500: '标普500指数 (SPY)',
    btc: '比特币 (BTC/USD)',
    eth: '以太坊 (ETH/USD)',
    nasdaq: '纳斯达克100 (QQQ)',
    someDataFailed: '部分市场数据加载失败',
    errorFetchingData: '获取市场数据时出错'
  },

  // 错误消息
  errors: {
    apiKeyNotSet: '请设置您的Polygon.io API密钥',
    httpError: 'HTTP错误！状态码：{status}',
    apiError: 'API错误：{message}',
    unknownError: '未知错误',
    networkError: '发生网络错误',
    dataLoadError: '加载数据时出错'
  },

  // 工具提示
  tooltips: {
    date: '日期：{date}',
    value: '数值：{value}',
    volume: '成交量：{volume}',
    price: '价格：${price}'
  }
}
