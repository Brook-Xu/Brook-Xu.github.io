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
    coreValues: 'Core values',
    products: 'Our Products',
    productsTitle: 'Our Products',
    riskManagement: 'Risk Management',
    partners: 'Partners',
    contactUs: 'Contact us',
    login: 'Login',
    language: 'Language'
  },

  // 首页
  home: {
    title: 'Unleash your growth with diverse strategies',
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
      title: 'Simplicity',
      description: 'Lower the barrier, demystify crypto and navigate volatility through quantitative methods.'
    },
    value2: {
      title: 'Professionalism',
      description: 'Provide the best strategies in the market with our experience and expertise in technology, finance and investment.'
    },
    value3: {
      title: 'Transparency',
      description: 'Open and real historical data for clients to gain a clear understanding of investment logics, team, and performances.'
    },
    product1: {
      title: 'Leading Crypto Quantitative Strategies',
      description: 'Comprehensive trading strategies across multiple crypto markets',
      feature1: 'Multi-strategy support',
      feature2: 'Unparalleled yields',
      feature3: 'Top trading teams'
    },
    product2: {
      title: 'Crypto Mining',
      description: 'Superior returns through sophisticated quantitative methods',
      feature1: 'Asia top3 mining farm',
      feature2: 'Stable mining machine sources',
      feature3: 'Hosting service post investment'
    },
    product3: {
      title: 'Data Analysis Platform',
      description: 'Expert quantitative analysts and traders',
      feature1: 'Multi-dimensional analysis',
      feature2: 'Visualization charts',
      feature3: 'Customized indicators to compare'
    },
    risk1: {
      title: 'Advanced Mathematical Models',
      point1: 'Including mean-variance optimization, risk parity, and factor-based models',
      point2: 'Systematically allocate capital and optimize the portfolio\'s risk-return profile'
    },
    risk2: {
      title: 'Portfolio Controls',
      point1: 'Exchange, symbol, and sector concentration limits',
      point2: 'Inventory bands and auto-reversion; daily loss halts; drawdown brakes; time-of-day/maintenance blacklists',
      point3: 'Dynamic risk controls and position sizing'
    },
    risk3: {
      title: 'Real-time Monitoring',
      point1: '24/7 alerts',
      point2: 'Dynamic leverage control',
      point3: 'Abnormal state handling'
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
    },
    fundChart: {
      title: 'Fund Performance',
      subtitle: 'Real-time NAV trend analysis'
    }
  },

  // About us
  about: {
    description: 'At Starnet Digital, we deliver cutting-edge digital asset management solutions to help investors navigate the dynamic world of blockchain, cryptocurrency, and decentralized finance. Our platform is built on secure, scalable, and tailored infrastructure – empowering clients to unlock the full value of their holdings.',
    details: 'With roots in proprietary trading, we have evolved into a full-spectrum digital asset manager, offering institutional-grade strategies backed by rigorous risk management. Our focus spans high-frequency trading (HFT), advanced DeFi strategies, and all-weather market-neutral approaches — designed to perform across market cycles and meet the evolving needs of institutional and professional investors.'
  },

  // 图表页面
  charts: {
    title: 'Data Visualization Chart',
    uploadSection: 'Upload Data File',
    uploadHint: 'Please select a CSV or Excel file to upload',
    fileRequirements: 'File Requirements:',
    supportedFormats: 'Supported Date Formats:',
    supportedColumns: 'Supported Column Names:',
    csvOnly: 'Supported file types: CSV, XLS, XLSX',
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
    noDataMessage: 'No data available. Please upload a CSV or Excel file above.',
    totalDataPoints: 'Total data points',
    dataTrendChart: 'Data Trend Chart',
    value: 'Value',
    selectCsvFile: 'Please select a CSV file only.',
    selectSupportedFile: 'Please select a supported file (CSV, XLS, or XLSX).',
    errorParsingCsv: 'Error parsing CSV file',
    errorReadingCsv: 'Error reading CSV file',
    errorParsingExcel: 'Error parsing Excel file',
    errorReadingExcel: 'Error reading Excel file',
    excelNoSheets: 'Excel file has no worksheets',
    excelEmpty: 'Excel file is empty or has no data',
    csvEmpty: 'CSV file is empty or invalid',
    csvMinColumns: 'File must have at least 2 columns',
    cannotIdentifyColumns: 'Could not identify date and value columns in file',
    invalidDateFormat: 'Invalid date format at row {row}: "{date}". Expected format: YYYY-MM-DD',
    invalidValue: 'Invalid value at row {row}: "{value}". Must be a number',
    metricsTitle: 'Performance Metrics',
    metrics: {
      metric: 'Metric',
      value: 'Value',
      uploadedData: 'Uploaded Data',
      sp500: 'S&P 500 (SPY)',
      nasdaq: 'NASDAQ (QQQ)',
      btc: 'Bitcoin (BTC)',
      eth: 'Ethereum (ETH)',
      startDate: 'Start Date',
      endDate: 'End Date',
      cumulativeReturn: 'Cumulative Return [%]',
      cagr: 'CAGR [%]',
      volatility: 'Volatility [%]',
      sharpeRatio: 'Sharpe',
      sortinoRatio: 'Sortino',
      maxDrawdown: 'Max Drawdown (MD) [%]',
      durationOfMD: 'Duration of MD [days]',
      maxDrawdownDuration: 'Max Drawdown Duration (MDD) [days]',
      drawdownOfMDD: 'Drawdown of MDD [%]',
      calmarRatio: 'Calmar',
      var95: '1-day VaR (95%)',
      var99Monthly: '1-month VaR (99%)',
      cvar95: 'CVaR (95%)',
      cvar99: 'CVaR (99%)',
      giniCoefficient: 'Gini Coefficient',
      omegaRatio: 'Omega Ratio',
      gainPainRatio: 'Gain/Pain Ratio (1M)',
      tailRatio: 'Tail Ratio',
      outlierWinRatio: 'Outlier Win Ratio',
      outlierLossRatio: 'Outlier Loss Ratio',
      rollingSharpe90dMean: 'Rolling Sharpe 90d Mean',
      rollingSharpe90dMedian: 'Rolling Sharpe 90d Median',
      rollingSharpe90dLast: 'Rolling Sharpe 90d Last',
      rollingSharpe365dMean: 'Rolling Sharpe 365d Mean',
      rollingSharpe365dMedian: 'Rolling Sharpe 365d Median',
      rollingSharpe365dLast: 'Rolling Sharpe 365d Last',
      mtd: 'MTD',
      return3M: '3M',
      return6M: '6M',
      ytd: 'YTD',
      bestDay: 'Best Day',
      worstDay: 'Worst Day',
      bestMonth: 'Best Month',
      worstMonth: 'Worst Month',
      bestYear: 'Best Year',
      worstYear: 'Worst Year',
      skew: 'Skewness',
      kurtosis: 'Kurtosis',
      days: 'days',
      dataPoints: 'Data Points',
      totalDays: 'Total Days',
      years: 'Years'
    },
    analysisChartsTitle: 'Analysis Charts',
    analysisCharts: {
      cumulativeReturns: 'Cumulative Returns',
      drawdown: 'Drawdown',
      rollingSharpe: 'Rolling Sharpe Ratio',
      monthlyReturns: 'Monthly Returns Heatmap',
      yearlyReturns: 'Yearly Returns',
      returnDistribution: 'Return Distribution',
      rollingVolatility: 'Rolling Volatility',
      netValue: 'Net Value',
      return: 'Return',
      monthlyReturn: 'Monthly Return',
      yearlyReturn: 'Yearly Return',
      returnRange: 'Return Range',
      frequency: 'Frequency'
    }
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
  },

  // 加密货币策略页面
  cryptoStrategies: {
    title: 'Leading Crypto Quantitative Strategies',
    yield2024: '2024 yield',
    yield2025: '2025 YTD yield',
    maxDrawdown: 'Max drawdown',
    minInvestment: 'Min investment amount',
    fees: 'Fees',
    strategy1: {
      title: 'Hybrid Arbitrage Strategy',
      yield: '24.27%',
      maxDrawdown: '0.37%',
      minInvestment: 'USD 300k',
      fees: 'no management fee, 30% performance fee'
    },
    strategy2: {
      title: 'JLP Hedging Arbitrage Strategy',
      yield: '20.13%',
      maxDrawdown: '0.12%',
      minInvestment: 'USD 300k',
      fees: 'no management fee, 30% performance fee'
    },
    strategy3: {
      title: 'Market LS Long Short Strategy',
      yield: '146.69%',
      maxDrawdown: '7.7%',
      minInvestment: 'USD 300k',
      fees: 'no management fee, 40% performance fee'
    },
    strategy4: {
      title: 'HFT Market Making Strategy',
      yield: '116%',
      maxDrawdown: '9.2%',
      minInvestment: 'USD 300k',
      fees: 'no management fee, 40% performance fee'
    }
  },

  // 认证相关
  auth: {
    login: {
      title: 'Login',
      email: 'Email',
      password: 'Password',
      submit: 'Login',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?",
      register: 'Register',
      success: 'Login successful',
      error: 'Login failed',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      invalidCredentials: 'Invalid email or password',
      emailNotVerified: 'Email not verified. Please verify your email first.'
    },
    register: {
      title: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      verificationCode: 'Verification Code',
      step1: 'Step 1: Enter your information',
      step2: 'Step 2: Verify your email',
      requestCode: 'Send Verification Code',
      submit: 'Register',
      verify: 'Verify',
      backToLogin: 'Back to Login',
      success: 'Registration successful! Please login.',
      error: 'Registration failed',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordMismatch: 'Passwords do not match',
      codeRequired: 'Verification code is required',
      codeSent: 'Verification code sent to your email',
      codeExpired: 'Verification code expired or invalid',
      emailExists: 'Email already registered',
      invalidEmail: 'Invalid email format'
    },
    forgotPassword: {
      title: 'Forgot Password',
      email: 'Email',
      code: 'Verification Code',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      step1: 'Step 1: Request reset code',
      step2: 'Step 2: Reset password',
      requestCode: 'Send Reset Code',
      reset: 'Reset Password',
      backToLogin: 'Back to Login',
      success: 'Password reset successful! Please login.',
      error: 'Password reset failed',
      emailRequired: 'Email is required',
      codeRequired: 'Verification code is required',
      passwordRequired: 'New password is required',
      passwordMismatch: 'Passwords do not match',
      codeSent: 'Reset code sent to your email',
      codeExpired: 'Reset code expired or invalid',
      emailNotFound: 'Email not found'
    },
    logout: {
      title: 'Logout',
      success: 'Logged out successfully',
      error: 'Logout failed'
    },
    userMenu: {
      profile: 'Profile',
      logout: 'Logout'
    }
  }
}
