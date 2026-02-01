/**
 * 指标计算辅助函数
 * 包含完整的指标计算逻辑，整合所有指标计算方法
 */

import * as metricsCalculator from './metricsCalculator';
import { normalizeDate, parseNumericValue } from './dataProcessor';

/**
 * 从 value 字段计算指标（如果没有 daily_return）
 */
export function calculateMetricsFromValue(parsedData, dateColumn) {
  if (!parsedData || parsedData.length < 2) {
    return null;
  }

  // 将累计收益转换为日收益率
  const values = parsedData.map(item => item.value);

  // 计算日收益率：从累计收益反推
  const dailyReturns = [];
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] > 0) {
      const dailyReturn = (values[i] - values[i - 1]) / values[i - 1];
      dailyReturns.push(dailyReturn);
    }
  }

  if (dailyReturns.length === 0) {
    return null;
  }

  const dates = parsedData.map(item => item.date).filter(date => date);
  if (dates.length < 2) {
    return null;
  }
  
  // 解析日期，支持字符串格式（如 "2021-01-01"）
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // 如果已经是 Date 对象
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }
    // 尝试解析字符串日期
    // 支持 "YYYY-MM-DD" 格式
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 月份从0开始
        const day = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        return isNaN(date.getTime()) ? null : date;
      }
    }
    // 尝试直接解析
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const firstDate = parseDate(dates[0]);
  const lastDate = parseDate(dates[dates.length - 1]);
  
  if (!firstDate || !lastDate) {
    console.error('Failed to parse dates in calculateMetricsFromValue:', { dates });
    return null;
  }
  
  const totalDays = Math.max(1, Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
  const years = totalDays / 365.25;

  // 格式化日期（不允许返回 N/A，如果解析失败则抛出错误）
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) {
      console.error('Invalid date in calculateMetricsFromValue formatDate:', date);
      throw new Error('Failed to format date');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 计算累计收益（从第一个值到最后一个值）
  const initialValue = values[0];
  const finalValue = values[values.length - 1];
  const cumulativeReturn = initialValue > 0 ? (finalValue / initialValue) - 1 : 0;

  // 确保 dates 和 dailyReturns 长度一致（dates 比 dailyReturns 多一个元素）
  // dailyReturns 从第二个值开始，所以 dates 也需要从第二个开始
  const alignedDates = dates.slice(1);

  return {
    startDate: formatDate(firstDate),
    endDate: formatDate(lastDate),
    cumulativeReturn: cumulativeReturn,
    cagr: metricsCalculator.calculateCAGR(dailyReturns, years),
    volatility: metricsCalculator.calculateVolatility(dailyReturns),
    sharpeRatio: metricsCalculator.calculateSharpeRatio(dailyReturns),
    sortinoRatio: metricsCalculator.calculateSortinoRatio(dailyReturns),
    maxDrawdown: metricsCalculator.calculateMaxDrawdown(dailyReturns),
    calmarRatio: metricsCalculator.calculateCalmarRatio(dailyReturns, years),
    var95: metricsCalculator.calculateVaR(dailyReturns, 0.95),
    cvar95: metricsCalculator.calculateCVaR(dailyReturns, 0.95),
    omegaRatio: metricsCalculator.calculateOmegaRatio(dailyReturns),
    tailRatio: metricsCalculator.calculateTailRatio(dailyReturns),
    maxDrawdownDuration: metricsCalculator.calculateMaxDrawdownDuration(dailyReturns, alignedDates),
    durationOfMD: metricsCalculator.calculateDurationOfMD(dailyReturns, alignedDates),
    drawdownOfMDD: metricsCalculator.calculateDrawdownOfMDD(dailyReturns, alignedDates),
    var99Monthly: metricsCalculator.calculateMonthlyVaR(dailyReturns, alignedDates, 0.99),
    cvar99: metricsCalculator.calculateCVaR(dailyReturns, 0.99),
    giniCoefficient: metricsCalculator.calculateGiniCoefficient(dailyReturns),
    gainPainRatio: metricsCalculator.calculateGainPainRatio(dailyReturns, alignedDates),
    outlierWinRatio: metricsCalculator.calculateOutlierWinRatio(dailyReturns),
    outlierLossRatio: metricsCalculator.calculateOutlierLossRatio(dailyReturns),
    rollingSharpe90dMean: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).mean,
    rollingSharpe90dMedian: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).median,
    rollingSharpe90dLast: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).last,
    rollingSharpe365dMean: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).mean,
    rollingSharpe365dMedian: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).median,
    rollingSharpe365dLast: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).last,
    mtd: metricsCalculator.calculateMTD(dailyReturns, alignedDates),
    return3M: metricsCalculator.calculatePeriodReturn(dailyReturns, alignedDates, 90),
    return6M: metricsCalculator.calculatePeriodReturn(dailyReturns, alignedDates, 180),
    ytd: metricsCalculator.calculateYTD(dailyReturns, alignedDates),
    bestDay: metricsCalculator.calculateBestDay(dailyReturns),
    worstDay: metricsCalculator.calculateWorstDay(dailyReturns),
    bestMonth: metricsCalculator.calculateBestMonth(dailyReturns, alignedDates),
    worstMonth: metricsCalculator.calculateWorstMonth(dailyReturns, alignedDates),
    bestYear: metricsCalculator.calculateBestYear(dailyReturns, alignedDates),
    worstYear: metricsCalculator.calculateWorstYear(dailyReturns, alignedDates),
    skew: metricsCalculator.calculateSkew(dailyReturns),
    kurtosis: metricsCalculator.calculateKurtosis(dailyReturns),
    totalDays: totalDays,
    years: years,
    dataPoints: dailyReturns.length
  };
}

/**
 * 计算所有指标（主方法）
 * 这个方法整合了原始 calculateMetrics 的逻辑
 */
export function calculateAllMetrics(rawData, dateColumn, parsedData, dataType, originalDates) {
  if (!rawData || rawData.length === 0) {
    return { metrics: null, dailyReturns: [], dates: [], originalDates: [] };
  }

  // 如果数据已经被转换为价格序列（从 daily_return 或 cumulative_return 转换），
  // 应该从转换后的价格序列计算日收益率，而不是使用原始数据
  if (dataType !== 'price' && parsedData && parsedData.length > 1) {
    // 数据已经被转换为价格序列，从价格序列计算日收益率
    const result = calculateMetricsFromValue(parsedData, 'date');
    if (result) {
      // 从 parsedData 反推 dailyReturns 和 dates
      const values = parsedData.map(item => item.value);
      const dailyReturns = [];
      const dates = [];
      
      // 从第二个值开始计算日收益率
      for (let i = 1; i < values.length; i++) {
        if (values[i - 1] > 0) {
          const dailyReturn = (values[i] - values[i - 1]) / values[i - 1];
          dailyReturns.push(dailyReturn);
          dates.push(parsedData[i].date);
        }
      }
      
      // 确保 dates 和 dailyReturns 长度一致
      const minLength = Math.min(dates.length, dailyReturns.length);
      const finalDates = dates.slice(0, minLength);
      const finalDailyReturns = dailyReturns.slice(0, minLength);
      
      // 保存原始日期数组（用于 startDate/endDate）
      const finalOriginalDates = originalDates && originalDates.length > 0 
        ? originalDates 
        : parsedData.map(item => item.date);
      
      return {
        metrics: result,
        dailyReturns: finalDailyReturns,
        dates: finalDates,
        originalDates: finalOriginalDates
      };
    }
    return { metrics: null, dailyReturns: [], dates: [], originalDates: [] };
  }

  // 检查是否有 daily_return 字段（仅当数据是原始价格数据时）
  const firstRow = rawData[0];
  const hasDailyReturn = 'daily_return' in firstRow && 
                        firstRow.daily_return !== '' && 
                        firstRow.daily_return !== null &&
                        firstRow.daily_return !== undefined;
  
  let dailyReturns = [];
  let dates = [];
  let finalOriginalDates = originalDates || [];
  
  if (hasDailyReturn) {
    // 提取 daily_return 数组和日期数组，确保它们一一对应
    const tempData = [];
    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      const dr = parseNumericValue(row.daily_return);
      if (!isNaN(dr)) {
        const dateStr = row[dateColumn];
        if (dateStr) {
          const normalized = normalizeDate(dateStr);
          if (normalized) {
            tempData.push({
              date: normalized,
              dailyReturn: dr
            });
          }
        }
      }
    }
    
    // 分离日期和收益率数组
    dates = tempData.map(item => item.date);
    dailyReturns = tempData.map(item => item.dailyReturn);
  } else {
    // 如果没有 daily_return，尝试从 parsedData 的 value 字段计算
    // 或者从原始数据的 cumulative_return 反推
    if (parsedData && parsedData.length > 1) {
      const result = calculateMetricsFromValue(parsedData, 'date');
      if (result) {
        // 从 parsedData 反推 dailyReturns 和 dates
        const values = parsedData.map(item => item.value);
        const tempDailyReturns = [];
        const tempDates = [];
        
        // 从第二个值开始计算日收益率
        for (let i = 1; i < values.length; i++) {
          if (values[i - 1] > 0) {
            const dailyReturn = (values[i] - values[i - 1]) / values[i - 1];
            tempDailyReturns.push(dailyReturn);
            tempDates.push(parsedData[i].date);
          }
        }
        
        // 确保 dates 和 dailyReturns 长度一致
        const minLength = Math.min(tempDates.length, tempDailyReturns.length);
        dates = tempDates.slice(0, minLength);
        dailyReturns = tempDailyReturns.slice(0, minLength);
        
        // 保存原始日期数组（用于 startDate/endDate）
        if (!finalOriginalDates || finalOriginalDates.length === 0) {
          finalOriginalDates = parsedData.map(item => item.date);
        }
        
        return {
          metrics: result,
          dailyReturns,
          dates,
          originalDates: finalOriginalDates
        };
      }
    } else if ('cumulative_return' in firstRow) {
      // 从 cumulative_return 反推 daily_return
      const cumulativeReturns = rawData
        .map(row => {
          const cr = parseNumericValue(row.cumulative_return);
          return isNaN(cr) ? null : cr;
        })
        .filter(cr => cr !== null);
      
      if (cumulativeReturns.length > 1) {
        dailyReturns = [];
        const rawDates = rawData
          .map(row => {
            const dateStr = row[dateColumn];
            if (!dateStr) return null;
            return normalizeDate(dateStr);
          })
          .filter(date => date !== null);
        
        // 保存原始日期数组（用于 startDate/endDate）
        finalOriginalDates = [...rawDates];
        dates = [];
        
        for (let i = 1; i < cumulativeReturns.length; i++) {
          const prevCumulative = cumulativeReturns[i - 1];
          const currCumulative = cumulativeReturns[i];
          if (prevCumulative !== null && currCumulative !== null) {
            // 价格：price[i] = 1 + cumulative_return[i]
            const prevPrice = 1 + prevCumulative;
            const currPrice = 1 + currCumulative;
            if (prevPrice > 0) {
              // daily_return[i] = (price[i] - price[i-1]) / price[i-1]
              const dailyReturn = (currPrice / prevPrice) - 1;
              dailyReturns.push(dailyReturn);
              if (i < rawDates.length) {
                dates.push(rawDates[i]);
              }
            }
          }
        }
        
        // 确保 dates 和 dailyReturns 长度一致
        const minLen = Math.min(dates.length, dailyReturns.length);
        dates = dates.slice(0, minLen);
        dailyReturns = dailyReturns.slice(0, minLen);
      }
    }
  }

  if (dailyReturns.length === 0) {
    return { metrics: null, dailyReturns: [], dates: [], originalDates: [] };
  }

  // 提取日期（如果还没有保存）
  if (!dates || dates.length === 0) {
    dates = rawData
      .map(row => {
        const dateStr = row[dateColumn];
        if (!dateStr) return null;
        return normalizeDate(dateStr);
      })
      .filter(date => date !== null);
    // 保存原始日期数组（用于 startDate/endDate）
    if (!finalOriginalDates || finalOriginalDates.length === 0) {
      finalOriginalDates = [...dates];
    }
  } else if (!finalOriginalDates || finalOriginalDates.length === 0) {
    // 如果 dates 已存在但 originalDates 不存在，使用 dates 作为 originalDates
    finalOriginalDates = [...dates];
  }

  // 确保 dates 和 dailyReturns 长度一致
  const minLength = Math.min(dates.length, dailyReturns.length);
  dates = dates.slice(0, minLength);
  dailyReturns = dailyReturns.slice(0, minLength);

  if (dates.length === 0 || dailyReturns.length === 0) {
    return { metrics: null, dailyReturns: [], dates: [], originalDates: [] };
  }

  // 解析日期，支持字符串格式（如 "2021-01-01"）
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    // 如果已经是 Date 对象
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }
    // 尝试解析字符串日期
    // 支持 "YYYY-MM-DD" 格式
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 月份从0开始
        const day = parseInt(parts[2], 10);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
    }
    // 尝试直接解析
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  // 优先使用原始日期数组（如果有的话，说明是从 cumulative_return 反推的）
  let firstDate = null;
  let lastDate = null;
  
  if (finalOriginalDates && finalOriginalDates.length > 0) {
    // 使用原始日期数组的第一个和最后一个日期
    firstDate = parseDate(finalOriginalDates[0]);
    lastDate = parseDate(finalOriginalDates[finalOriginalDates.length - 1]);
  }
  
  // 如果没有原始日期数组或解析失败，使用当前 dates 数组
  if (!firstDate || !lastDate) {
    if (dates && dates.length > 0) {
      firstDate = parseDate(dates[0]);
      lastDate = parseDate(dates[dates.length - 1]);
    }
  }
  
  // 如果还是失败，尝试从 rawData 获取原始日期
  if (!firstDate || !lastDate) {
    const rawDates = rawData
      .map(row => {
        const dateStr = row[dateColumn];
        if (!dateStr) return null;
        return normalizeDate(dateStr);
      })
      .filter(date => date !== null);
    
    if (rawDates.length > 0) {
      const fallbackFirst = parseDate(rawDates[0]);
      const fallbackLast = parseDate(rawDates[rawDates.length - 1]);
      if (fallbackFirst && fallbackLast) {
        firstDate = fallbackFirst;
        lastDate = fallbackLast;
      }
    }
  }
  
  if (!firstDate || !lastDate) {
    console.error('Failed to parse dates after all attempts');
    return { metrics: null, dailyReturns: [], dates: [], originalDates: [] };
  }
  
  const totalDays = Math.max(1, Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
  const years = totalDays / 365.25;

  // 格式化日期（不允许返回 N/A，如果解析失败则抛出错误）
  const formatDate = (date) => {
    if (!date || isNaN(date.getTime())) {
      console.error('Invalid date in formatDate:', date);
      throw new Error('Failed to format date');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 计算所有指标
  const metrics = {
    // 基本信息
    startDate: formatDate(firstDate),
    endDate: formatDate(lastDate),
    
    // 1. 累计收益
    cumulativeReturn: metricsCalculator.calculateCumulativeReturn(dailyReturns),
    
    // 2. 年化收益率 (CAGR)
    cagr: metricsCalculator.calculateCAGR(dailyReturns, years),
    
    // 3. 年化波动率
    volatility: metricsCalculator.calculateVolatility(dailyReturns),
    
    // 4. 夏普比率
    sharpeRatio: metricsCalculator.calculateSharpeRatio(dailyReturns),
    
    // 5. Sortino Ratio
    sortinoRatio: metricsCalculator.calculateSortinoRatio(dailyReturns),
    
    // 6. 最大回撤
    maxDrawdown: metricsCalculator.calculateMaxDrawdown(dailyReturns),
    
    // 7. Duration of MD (最大回撤的持续时间)
    durationOfMD: metricsCalculator.calculateDurationOfMD(dailyReturns, dates),
    
    // 8. 最大回撤持续时间 (MDD)
    maxDrawdownDuration: metricsCalculator.calculateMaxDrawdownDuration(dailyReturns, dates),
    
    // 9. Drawdown of MDD (最长持续时间回撤的幅度)
    drawdownOfMDD: metricsCalculator.calculateDrawdownOfMDD(dailyReturns, dates),
    
    // 10. Calmar Ratio
    calmarRatio: metricsCalculator.calculateCalmarRatio(dailyReturns, years),
    
    // 11. VaR (95%)
    var95: metricsCalculator.calculateVaR(dailyReturns, 0.95),
    
    // 12. 1-month VaR (99%)
    var99Monthly: metricsCalculator.calculateMonthlyVaR(dailyReturns, dates, 0.99),
    
    // 13. CVaR (95%)
    cvar95: metricsCalculator.calculateCVaR(dailyReturns, 0.95),
    
    // 14. CVaR (99%)
    cvar99: metricsCalculator.calculateCVaR(dailyReturns, 0.99),
    
    // 15. Gini Coefficient
    giniCoefficient: metricsCalculator.calculateGiniCoefficient(dailyReturns),
    
    // 16. Omega Ratio
    omegaRatio: metricsCalculator.calculateOmegaRatio(dailyReturns),
    
    // 17. Gain/Pain Ratio (1M)
    gainPainRatio: metricsCalculator.calculateGainPainRatio(dailyReturns, dates),
    
    // 18. Tail Ratio
    tailRatio: metricsCalculator.calculateTailRatio(dailyReturns),
    
    // 19. Outlier Win Ratio
    outlierWinRatio: metricsCalculator.calculateOutlierWinRatio(dailyReturns),
    
    // 20. Outlier Loss Ratio
    outlierLossRatio: metricsCalculator.calculateOutlierLossRatio(dailyReturns),
    
    // 21. Rolling Sharpe 90d Mean/Median/Last
    rollingSharpe90dMean: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).mean,
    rollingSharpe90dMedian: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).median,
    rollingSharpe90dLast: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 90).last,
    
    // 22. Rolling Sharpe 365d Mean/Median/Last
    rollingSharpe365dMean: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).mean,
    rollingSharpe365dMedian: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).median,
    rollingSharpe365dLast: metricsCalculator.calculateRollingSharpeStats(dailyReturns, 365).last,
    
    // 23. MTD / 3M / 6M / YTD
    mtd: metricsCalculator.calculateMTD(dailyReturns, dates),
    return3M: metricsCalculator.calculatePeriodReturn(dailyReturns, dates, 90),
    return6M: metricsCalculator.calculatePeriodReturn(dailyReturns, dates, 180),
    ytd: metricsCalculator.calculateYTD(dailyReturns, dates),
    
    // 24. 最佳/最差单日收益
    bestDay: metricsCalculator.calculateBestDay(dailyReturns),
    worstDay: metricsCalculator.calculateWorstDay(dailyReturns),
    
    // 25. 最佳/最差单月收益
    bestMonth: metricsCalculator.calculateBestMonth(dailyReturns, dates),
    worstMonth: metricsCalculator.calculateWorstMonth(dailyReturns, dates),
    
    // 26. 最佳/最差年度收益
    bestYear: metricsCalculator.calculateBestYear(dailyReturns, dates),
    worstYear: metricsCalculator.calculateWorstYear(dailyReturns, dates),
    
    // 27. 偏度
    skew: metricsCalculator.calculateSkew(dailyReturns),
    
    // 28. 峰度
    kurtosis: metricsCalculator.calculateKurtosis(dailyReturns),
    
    // 额外信息
    totalDays: totalDays,
    years: years,
    dataPoints: dailyReturns.length
  };

  return {
    metrics,
    dailyReturns,
    dates,
    originalDates: finalOriginalDates
  };
}
