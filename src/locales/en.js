export default {
  // 通用
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    upload: 'Upload',
    download: 'Download',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    retry: 'Retry'
  },

  // 导航栏
  navigation: {
    home: 'Home',
    aboutUs: 'About us',
    coreValues: 'Our core values',
    products: 'Our products',
    riskManagement: 'Risk Management',
    partners: 'Partners',
    contactUs: 'Contact us',
    login: 'Login',
    language: 'Language'
  },

  // 首页
  home: {
    title: 'Unleash growth with diverse strategies',
    subtitle: '',
    learnMore: 'Learn More',
    viewCharts: 'View Charts',
    fetchMarketData: 'Fetch Market Data',
    marketDataCharts: 'Market Data Charts',
    apiError: 'API Error',
    noDataAvailable: 'No Data Available',
    dataPoints: 'Data Points',
    dateRange: 'Date Range',
    volume: 'Volume',
    open: 'Open',
    high: 'High',
    low: 'Low',
    close: 'Close',
    vwap: 'VWAP',
    aboutDescription: 'We are an innovative company focused on quantitative financial technology, committed to providing investors with the most advanced data analysis and trading solutions.',
    feature1: {
      title: 'Real-time Data',
      description: 'Provide millisecond-level market data updates to ensure you get the latest market information.'
    },
    feature2: {
      title: 'Smart Analysis',
      description: 'Machine learning-based intelligent analysis algorithms to help you discover market opportunities.'
    },
    feature3: {
      title: 'Risk Control',
      description: 'Comprehensive risk management system to protect your investment safety.'
    },
    value1: {
      title: 'Professional',
      description: 'We have a professional financial and technical team to provide you with the most professional service.'
    },
    value2: {
      title: 'Innovation',
      description: 'Continuous innovation, constantly launching new products and services to meet market demands.'
    },
    value3: {
      title: 'Reliable',
      description: 'Stable system architecture, 7x24 hours uninterrupted service to ensure your business continuity.'
    },
    product1: {
      title: 'Quantitative Trading System',
      description: 'Advanced algorithm-based quantitative trading system to help you achieve automated trading.',
      feature1: 'Multi-strategy Support',
      feature2: 'Real-time Risk Control',
      feature3: 'Backtesting Analysis'
    },
    product2: {
      title: 'Data Analysis Platform',
      description: 'Powerful data analysis platform providing comprehensive market insights.',
      feature1: 'Multi-dimensional Analysis',
      feature2: 'Visualization Charts',
      feature3: 'Custom Indicators'
    },
    product3: {
      title: 'AI Smart Assistant',
      description: 'AI-based smart assistant providing personalized investment advice.',
      feature1: 'Smart Recommendations',
      feature2: 'Risk Alerts',
      feature3: 'Personalized Service'
    },
    risk1: {
      title: 'Market Risk',
      description: 'Effectively control market risk through diversified portfolios and dynamic hedging strategies.'
    },
    risk2: {
      title: 'Technical Risk',
      description: 'Adopt advanced technical architecture and multiple backup mechanisms to ensure stable system operation.'
    },
    risk3: {
      title: 'Compliance Risk',
      description: 'Strictly comply with relevant regulations and establish a comprehensive compliance management system.'
    },
    partner1: {
      name: 'Leading Banks',
      description: 'Establish strategic partnerships with multiple leading banks to provide fund custody services.'
    },
    partner2: {
      name: 'Securities Companies',
      description: 'Cooperate with top securities companies to provide professional trading execution services.'
    },
    partner3: {
      name: 'Technology Companies',
      description: 'Partner with leading technology companies to jointly develop innovative products.'
    },
    contactInfo: {
      title: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      addressText: '88 Financial Street, Chaoyang District, Beijing'
    },
    contactForm: {
      title: 'Contact Us',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send Message',
      successMessage: 'Message sent successfully! We will reply to you as soon as possible.'
    }
  },

  // About us
  about: {
    description: 'At Starnet Digital, we deliver cutting-edge digital asset management solutions to help investors navigate the dynamic world of blockchain, cryptocurrency, and decentralized finance. Our platform is built on secure, scalable, and tailored infrastructure – empowering clients to unlock the full value of their holdings.',
    details: 'With roots in proprietary trading, we have evolved into a full-spectrum digital asset manager, offering institutional-grade strategies backed by rigorous risk management. Our focus spans high-frequency trading (HFT), advanced DeFi strategies, and all-weather market-neutral approaches — designed to perform across market cycles and meet the evolving needs of institutional and professional investors.'
  },

  // 图表页面
  charts: {
    title: 'CSV Data Visualization Chart',
    uploadSection: 'Upload CSV File',
    uploadHint: 'Please select a CSV file to upload',
    fileRequirements: 'File Requirements:',
    supportedFormats: 'Supported Date Formats:',
    supportedColumns: 'Supported Column Names:',
    csvOnly: 'Only CSV files are supported',
    firstColumnDate: 'First column: date (various formats supported)',
    secondColumnValue: 'Second column: numeric value',
    autoDetect: 'Column names are automatically detected',
    dateFormats: [
      'YYYY-MM-DD, MM/DD/YYYY, MM-DD-YYYY',
      'YYYY/MM/DD, MM/DD/YY',
      'YYYY-MM-DD HH:MM:SS'
    ],
    columnNames: {
      date: 'Date: date, time, timestamp, day, month, year, 日期, 时间, etc.',
      value: 'Value: value, price, amount, quantity, count, number, 数值, 价格, etc.'
    },
    noDataMessage: 'No data available. Please upload a CSV file above.',
    totalDataPoints: 'Total data points',
    dataTrendChart: 'Data Trend Chart',
    value: 'Value',
    selectCsvFile: 'Please select a CSV file only.',
    errorParsingCsv: 'Error parsing CSV file',
    errorReadingCsv: 'Error reading CSV file',
    csvEmpty: 'CSV file is empty or invalid',
    csvMinColumns: 'CSV file must have at least 2 columns',
    cannotIdentifyColumns: 'Could not identify date and value columns in CSV file',
    invalidDateFormat: 'Invalid date format at row {row}: "{date}". Expected format: YYYY-MM-DD',
    invalidValue: 'Invalid value at row {row}: "{value}". Must be a number'
  },

  // 市场数据
  marketData: {
    sp500: 'S&P 500 Index (SPY)',
    btc: 'Bitcoin (BTC/USD)',
    eth: 'Ethereum (ETH/USD)',
    nasdaq: 'NASDAQ 100 (QQQ)',
    someDataFailed: 'Some market data failed to load',
    errorFetchingData: 'Error fetching market data'
  },

  // 错误消息
  errors: {
    apiKeyNotSet: 'Please set your Polygon.io API key',
    httpError: 'HTTP error! status: {status}',
    apiError: 'API error: {message}',
    unknownError: 'Unknown error',
    networkError: 'Network error occurred',
    dataLoadError: 'Error loading data'
  },

  // 工具提示
  tooltips: {
    date: 'Date: {date}',
    value: 'Value: {value}',
    volume: 'Volume: {volume}',
    price: 'Price: ${price}'
  }
}
