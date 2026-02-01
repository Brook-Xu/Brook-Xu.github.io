/**
 * 数据处理工具函数
 * 包含日期解析、CSV解析、数据转换等功能
 */

/**
 * 检测日期列
 */
export function detectDateColumn(data) {
  if (!data || data.length === 0) {
    return null;
  }

  const firstRow = data[0];
  const columnNames = Object.keys(firstRow).filter(name => name && name.trim() !== '');
  
  if (columnNames.length < 2) {
    return null;
  }

  // 优先检测 daily_returns.csv 格式的字段
  const hasDailyReturnFields = columnNames.some(name => 
    name === 'date' || name === 'daily_return' || name === 'cumulative_return'
  );

  if (hasDailyReturnFields) {
    if (columnNames.includes('date')) {
      return 'date';
    } else if (columnNames.includes('candle_begin_time')) {
      return 'candle_begin_time';
    }
  } else {
    // 原有的智能检测逻辑
    const firstColumnName = columnNames[0];
    const firstColumnValue = firstRow[firstColumnName];
    if (isDateColumn(firstColumnValue) || isDateColumnSlashFormat(firstColumnValue)) {
      return firstColumnName;
    } else {
      // 如果第一列不是日期，尝试查找包含日期关键词的列
      for (const colName of columnNames) {
        if (isDateColumnName(colName)) {
          return colName;
        }
      }
      
      // 如果没找到明确的列名，使用第一列作为日期
      return columnNames[0];
    }
  }

  return columnNames[0] || null;
}

/**
 * 判断是否为日期列（YYYY-MM-DD格式）
 */
export function isDateColumn(value) {
  if (!value || typeof value !== 'string') return false;
  const dashRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
  return dashRegex.test(value.trim());
}

/**
 * 判断是否为日期列（YYYY/M/D格式）
 */
export function isDateColumnSlashFormat(value) {
  if (!value || typeof value !== 'string') return false;
  const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
  return dateRegex.test(value.trim());
}

/**
 * 判断列名是否为日期列
 */
export function isDateColumnName(columnName) {
  if (!columnName) return false;
  const dateKeywords = ['date', 'time', 'timestamp', 'day', 'month', 'year', '日期', '时间'];
  const lowerName = columnName.toLowerCase();
  return dateKeywords.some(keyword => lowerName.includes(keyword));
}

/**
 * 判断列名是否为数值列
 * 扩展了关键词列表，支持更多用户自定义的列名
 */
export function isValueColumnName(columnName) {
  if (!columnName) return false;
  const lowerName = columnName.toLowerCase().trim();
  
  // 扩展的数值列关键词列表，按优先级分类
  const valueKeywords = [
    // 通用数值关键词
    'value', '数值', '数据', 'data',
    // 价格相关关键词
    'price', '价格', 'close', '收盘', 'open', '开盘', 'high', '最高', 'low', '最低',
    // 净值相关关键词
    'nav', '净值', 'net', 'netvalue', 'net_value',
    // 金额/数量相关关键词
    'amount', '金额', 'quantity', '数量', 'count', '计数', 'number', '数字',
    // 收益率相关关键词（这些会被特殊处理）
    'return', '收益', '收益率', 'yield', '回报', '回报率',
    'daily_return', '日收益', '日收益率',
    'cumulative_return', '累计收益', '累计收益率',
    'total_return', '总收益', '总收益率',
    // 其他常见金融术语
    'pnl', '盈亏', 'profit', '利润', 'loss', '亏损',
    'balance', '余额', 'equity', '权益',
    'volume', '成交量', 'vol', '量',
    // 其他可能的数值列名
    'val', 'val_', 'value_', 'price_', 'price_', 'amt', 'qty'
  ];
  
  // 检查是否包含任何关键词
  return valueKeywords.some(keyword => lowerName.includes(keyword));
}

/**
 * 根据列名判断数据类型，返回更详细的数据类型信息
 * @param {string} columnName - 列名
 * @returns {object} 包含数据类型和置信度的对象
 */
export function detectValueColumnType(columnName) {
  if (!columnName) return { type: 'price', confidence: 'low' };
  
  const lowerName = columnName.toLowerCase().trim();
  
  // 收益率类型（高优先级）
  if (lowerName.includes('daily_return') || lowerName.includes('日收益')) {
    return { type: 'daily_return', confidence: 'high' };
  }
  if (lowerName.includes('cumulative_return') || lowerName.includes('累计收益')) {
    return { type: 'cumulative_return', confidence: 'high' };
  }
  if (lowerName.includes('total_return') || lowerName.includes('总收益')) {
    return { type: 'cumulative_return', confidence: 'medium' };
  }
  if (lowerName.includes('return') || lowerName.includes('收益') || lowerName.includes('收益率')) {
    // 需要进一步判断是日收益还是累计收益，默认按累计收益处理
    return { type: 'return', confidence: 'medium' };
  }
  
  // 净值类型
  if (lowerName.includes('nav') || lowerName.includes('净值') || 
      lowerName.includes('netvalue') || lowerName.includes('net_value')) {
    return { type: 'price', confidence: 'high' };
  }
  
  // 价格类型
  if (lowerName.includes('price') || lowerName.includes('价格') ||
      lowerName.includes('close') || lowerName.includes('收盘') ||
      lowerName.includes('open') || lowerName.includes('开盘')) {
    return { type: 'price', confidence: 'high' };
  }
  
  // 默认按价格处理
  return { type: 'price', confidence: 'medium' };
}

/**
 * 增强的日期格式检测和转换
 */
export function normalizeDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }
  
  const trimmed = dateStr.trim();
  
  // 1. 尝试 YYYY/M/D 或 YYYY/MM/DD 格式
  if (isDateColumnSlashFormat(trimmed)) {
    return convertDateToStandardFormat(trimmed);
  }
  
  // 2. 尝试 YYYY-MM-DD 格式
  if (isDateColumn(trimmed)) {
    // 确保月份和日期是两位数
    const parts = trimmed.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return trimmed;
  }
  
  // 3. 尝试其他常见格式：MM/DD/YYYY, DD/MM/YYYY, YYYY.MM.DD 等
  // MM/DD/YYYY 或 M/D/YYYY
  const usDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const usMatch = trimmed.match(usDateRegex);
  if (usMatch) {
    const [, month, day, year] = usMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // DD/MM/YYYY 或 D/M/YYYY
  const euDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const euMatch = trimmed.match(euDateRegex);
  if (euMatch) {
    const [, part1, part2, year] = euMatch;
    const num1 = parseInt(part1);
    const num2 = parseInt(part2);
    if (num1 > 12 && num2 <= 12) {
      // 可能是 DD/MM/YYYY
      return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
    } else if (num1 <= 12 && num2 <= 12) {
      // 可能是 MM/DD/YYYY（默认）
      return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
    }
  }
  
  // YYYY.MM.DD 或 YYYY.M.D
  const dotDateRegex = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;
  const dotMatch = trimmed.match(dotDateRegex);
  if (dotMatch) {
    const [, year, month, day] = dotMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // 4. 尝试使用 JavaScript Date 对象解析
  const dateObj = new Date(trimmed);
  if (!isNaN(dateObj.getTime())) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  return null;
}

/**
 * 将 YYYY/M/D 格式转换为 YYYY-MM-DD 格式
 */
export function convertDateToStandardFormat(dateStr) {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return dateStr;
  }
  const year = parts[0];
  const month = parts[1].padStart(2, '0');
  const day = parts[2].padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 解析数值字符串，支持百分比格式
 * 例如："0.12%" -> 0.0012, "12%" -> 0.12, "0.12" -> 0.12
 */
export function parseNumericValue(valueStr) {
  if (valueStr === null || valueStr === undefined || valueStr === '') {
    return NaN;
  }
  
  // 如果已经是数字，直接返回
  if (typeof valueStr === 'number') {
    return valueStr;
  }
  
  // 转换为字符串并去除空格
  const str = String(valueStr).trim();
  
  // 如果字符串以 % 结尾，去掉 % 并除以 100
  if (str.endsWith('%')) {
    const numStr = str.slice(0, -1).trim();
    const num = parseFloat(numStr);
    if (isNaN(num)) {
      return NaN;
    }
    return num / 100;
  }
  
  // 否则直接使用 parseFloat
  return parseFloat(str);
}

/**
 * 将 daily_return（每天的涨跌变化值）转换为价格序列
 */
export function convertDailyReturnToPriceSeries(parsedData) {
  if (!parsedData || parsedData.length === 0) {
    return parsedData;
  }

  const priceSeries = [];
  let currentPrice = 1; // 初始价格为1

  for (const item of parsedData) {
    // price[i] = price[i-1] * (1 + daily_return[i])
    currentPrice = currentPrice * (1 + item.value);
    priceSeries.push({
      date: item.date,
      value: currentPrice
    });
  }

  return priceSeries;
}

/**
 * 将 cumulative_return（累计的涨跌变化值）转换为价格序列
 */
export function convertCumulativeReturnToPriceSeries(parsedData) {
  if (!parsedData || parsedData.length === 0) {
    return parsedData;
  }

  // 初始价格为1，之后每天的价格 = 1 + cumulative_return（累加值）
  return parsedData.map(item => ({
    date: item.date,
    value: 1 + item.value  // 初始价格1 + 累计涨跌变化值（累加值）
  }));
}

/**
 * 从CSV数据中提取日期范围
 */
export function extractDateRangeFromCSV(csvData) {
  if (!csvData || csvData.length === 0) {
    return null;
  }

  // 提取所有日期（parsedData中的日期已经通过normalizeDate标准化为YYYY-MM-DD格式）
  const dates = csvData
    .map(item => item.date)
    .filter(date => date) // 过滤掉空值
    .map(date => {
      // 处理字符串格式（应该是YYYY-MM-DD）
      if (typeof date === 'string') {
        // 如果已经是 YYYY-MM-DD 格式，直接返回
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
        // 如果是 YYYY/M/D 格式，转换为 YYYY-MM-DD（以防万一）
        if (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(date)) {
          const parts = date.split('/');
          const year = parts[0];
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
      }
      // 如果是 Date 对象，转换为 YYYY-MM-DD
      if (date instanceof Date) {
        return date.toISOString().split('T')[0];
      }
      return null;
    })
    .filter(date => date !== null)
    .sort(); // 排序以便找到最早和最晚的日期

  if (dates.length === 0) {
    return null;
  }

  return {
    fromDate: dates[0],
    toDate: dates[dates.length - 1]
  };
}

/**
 * 将市场数据（OHLC）转换为日收益率
 */
export function convertMarketDataToDailyReturns(marketData) {
  if (!marketData || !marketData.results || marketData.results.length < 2) {
    return { dailyReturns: [], dates: [] };
  }

  // 按时间排序
  const sortedResults = [...marketData.results]
    .filter(item => item && item.t && item.c !== null && item.c !== undefined && !isNaN(item.c))
    .sort((a, b) => a.t - b.t);

  if (sortedResults.length < 2) {
    return { dailyReturns: [], dates: [] };
  }

  const dailyReturns = [];
  const dates = [];

  for (let i = 1; i < sortedResults.length; i++) {
    const prevClose = sortedResults[i - 1].c;
    const currClose = sortedResults[i].c;

    if (prevClose > 0 && currClose > 0) {
      const dailyReturn = (currClose - prevClose) / prevClose;
      dailyReturns.push(dailyReturn);
      
      // 格式化日期
      try {
        const date = new Date(sortedResults[i].t);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dates.push(`${year}-${month}-${day}`);
      } catch (e) {
        dates.push(new Date(sortedResults[i].t).toISOString().split('T')[0]);
      }
    }
  }

  return { dailyReturns, dates };
}
