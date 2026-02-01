/**
 * 指标计算工具函数
 * 包含所有金融指标的计算方法
 */

// 1. 累计收益
export function calculateCumulativeReturn(dailyReturns) {
  let cumulative = 1;
  for (const dr of dailyReturns) {
    cumulative *= (1 + dr);
  }
  return cumulative - 1;
}

// 2. 年化收益率 (CAGR)
export function calculateCAGR(dailyReturns, years) {
  if (years <= 0) return 0;
  const cumulativeReturn = calculateCumulativeReturn(dailyReturns);
  const totalReturn = cumulativeReturn + 1;
  return Math.pow(totalReturn, 1 / years) - 1;
}

// 3. 年化波动率
export function calculateVolatility(dailyReturns) {
  if (dailyReturns.length < 2) return 0;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  return stdDev * Math.sqrt(252); // 年化
}

// 4. 夏普比率
export function calculateSharpeRatio(dailyReturns) {
  if (dailyReturns.length < 2) return 0;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const volatility = calculateVolatility(dailyReturns);
  if (volatility === 0) return 0;
  const annualizedReturn = mean * 252;
  return annualizedReturn / volatility;
}

// 5. Sortino Ratio
export function calculateSortinoRatio(dailyReturns) {
  if (dailyReturns.length < 2) return 0;
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const negativeReturns = dailyReturns.filter(dr => dr < 0);
  if (negativeReturns.length === 0) return Infinity;
  const downsideVariance = negativeReturns.reduce((sum, dr) => sum + Math.pow(dr, 2), 0) / dailyReturns.length;
  const downsideStdDev = Math.sqrt(downsideVariance);
  if (downsideStdDev === 0) return 0;
  const annualizedReturn = mean * 252;
  const annualizedDownsideVol = downsideStdDev * Math.sqrt(252);
  return annualizedReturn / annualizedDownsideVol;
}

// 6. 最大回撤
export function calculateMaxDrawdown(dailyReturns) {
  let cumulative = 1;
  let maxCumulative = 1;
  let maxDrawdown = 0;
  
  for (const dr of dailyReturns) {
    cumulative *= (1 + dr);
    if (cumulative > maxCumulative) {
      maxCumulative = cumulative;
    }
    const drawdown = (cumulative / maxCumulative) - 1;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown;
}

// 7. Calmar Ratio
export function calculateCalmarRatio(dailyReturns, years) {
  const cagr = calculateCAGR(dailyReturns, years);
  const maxDrawdown = calculateMaxDrawdown(dailyReturns);
  if (maxDrawdown === 0) return 0;
  return cagr / Math.abs(maxDrawdown);
}

// 8. VaR (Value at Risk)
export function calculateVaR(dailyReturns, confidence) {
  if (dailyReturns.length === 0) return 0;
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return sorted[Math.max(0, index)];
}

// 9. CVaR (Conditional VaR)
export function calculateCVaR(dailyReturns, confidence) {
  const varValue = calculateVaR(dailyReturns, confidence);
  const tailReturns = dailyReturns.filter(dr => dr <= varValue);
  if (tailReturns.length === 0) return varValue;
  return tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length;
}

// 10. Omega Ratio
export function calculateOmegaRatio(dailyReturns, threshold = 0) {
  const positiveReturns = dailyReturns.filter(dr => dr > threshold);
  const negativeReturns = dailyReturns.filter(dr => dr < threshold);
  
  if (negativeReturns.length === 0) return Infinity;
  
  const positiveSum = positiveReturns.reduce((sum, dr) => sum + (dr - threshold), 0);
  const negativeSum = negativeReturns.reduce((sum, dr) => sum + Math.abs(dr - threshold), 0);
  
  if (negativeSum === 0) return Infinity;
  return positiveSum / negativeSum;
}

// 11. Tail Ratio
export function calculateTailRatio(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(0.95 * sorted.length)];
  const p5 = sorted[Math.floor(0.05 * sorted.length)];
  if (p5 === 0) return Infinity;
  return Math.abs(p95 / p5);
}

// 12. 最大回撤持续时间
export function calculateMaxDrawdownDuration(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  let cumulative = 1;
  let maxCumulative = 1;
  let maxCumulativeIndex = 0;
  let drawdownStartIndex = -1;
  let maxDrawdownDuration = 0;
  
  for (let i = 0; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
    
    if (cumulative > maxCumulative) {
      if (drawdownStartIndex >= 0) {
        const duration = i - drawdownStartIndex;
        if (duration > maxDrawdownDuration) {
          maxDrawdownDuration = duration;
        }
        drawdownStartIndex = -1;
      }
      maxCumulative = cumulative;
      maxCumulativeIndex = i;
    } else if (drawdownStartIndex < 0 && cumulative < maxCumulative) {
      drawdownStartIndex = maxCumulativeIndex;
    }
  }
  
  if (drawdownStartIndex >= 0) {
    const duration = dailyReturns.length - 1 - drawdownStartIndex;
    if (duration > maxDrawdownDuration) {
      maxDrawdownDuration = duration;
    }
  }
  
  return maxDrawdownDuration;
}

// 13. 最佳单日收益
export function calculateBestDay(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  return Math.max(...dailyReturns);
}

// 14. 最差单日收益
export function calculateWorstDay(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  return Math.min(...dailyReturns);
}

// 15. 最佳单月收益
export function calculateBestMonth(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const monthlyReturns = calculateMonthlyReturns(dailyReturns, dates);
  if (monthlyReturns.length === 0) return 0;
  return Math.max(...monthlyReturns);
}

// 16. 最差单月收益
export function calculateWorstMonth(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const monthlyReturns = calculateMonthlyReturns(dailyReturns, dates);
  if (monthlyReturns.length === 0) return 0;
  return Math.min(...monthlyReturns);
}

// 辅助方法：计算每月收益
export function calculateMonthlyReturns(dailyReturns, dates) {
  const monthlyData = {};
  
  for (let i = 0; i < dates.length && i < dailyReturns.length; i++) {
    let date;
    try {
      date = new Date(dates[i]);
      if (isNaN(date.getTime())) {
        const dateStr = dates[i];
        if (dateStr && dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts.length >= 2) {
            date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2] || 1));
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } catch (e) {
      continue;
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }
    monthlyData[monthKey].push(dailyReturns[i]);
  }
  
  const monthlyReturns = [];
  Object.keys(monthlyData).forEach(monthKey => {
    const returns = monthlyData[monthKey];
    if (returns.length > 0) {
      let monthlyReturn = 1;
      for (const dr of returns) {
        monthlyReturn *= (1 + dr);
      }
      monthlyReturns.push(monthlyReturn - 1);
    }
  });
  
  return monthlyReturns;
}

// 17. 偏度
export function calculateSkew(dailyReturns) {
  if (dailyReturns.length < 3) return 0;
  
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  const n = dailyReturns.length;
  const skewness = dailyReturns.reduce((sum, dr) => {
    return sum + Math.pow((dr - mean) / stdDev, 3);
  }, 0) / n;
  
  return skewness;
}

// 18. 峰度
export function calculateKurtosis(dailyReturns) {
  if (dailyReturns.length < 4) return 0;
  
  const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
  const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  const n = dailyReturns.length;
  const kurtosis = dailyReturns.reduce((sum, dr) => {
    return sum + Math.pow((dr - mean) / stdDev, 4);
  }, 0) / n - 3;
  
  return kurtosis;
}

// 19. Duration of MD (最大回撤的持续时间)
export function calculateDurationOfMD(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  let cumulative = 1;
  let maxCumulative = 1;
  let maxCumulativeIndex = 0;
  let maxDrawdown = 0;
  let maxDrawdownStartIndex = -1;
  let maxDrawdownEndIndex = -1;
  
  for (let i = 0; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
    
    if (cumulative > maxCumulative) {
      maxCumulative = cumulative;
      maxCumulativeIndex = i;
    }
    
    const drawdown = (cumulative / maxCumulative) - 1;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
      if (maxDrawdownStartIndex < 0) {
        maxDrawdownStartIndex = maxCumulativeIndex;
      }
      maxDrawdownEndIndex = i;
    }
  }
  
  if (maxDrawdownStartIndex >= 0 && maxDrawdownEndIndex >= 0) {
    let recoveryIndex = -1;
    const startCumulative = maxCumulative;
    for (let i = maxDrawdownEndIndex + 1; i < dailyReturns.length; i++) {
      let testCumulative = 1;
      for (let j = 0; j <= i; j++) {
        testCumulative *= (1 + dailyReturns[j]);
      }
      if (testCumulative >= startCumulative) {
        recoveryIndex = i;
        break;
      }
    }
    
    if (recoveryIndex >= 0) {
      return recoveryIndex - maxDrawdownStartIndex;
    }
    return dailyReturns.length - 1 - maxDrawdownStartIndex;
  }
  
  return 0;
}

// 20. Drawdown of MDD (最长持续时间回撤的幅度)
export function calculateDrawdownOfMDD(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  let cumulative = 1;
  let maxCumulative = 1;
  let maxCumulativeIndex = 0;
  let drawdownStartIndex = -1;
  let maxDrawdownDuration = 0;
  let maxDrawdownDurationStartIndex = -1;
  let maxDrawdownDurationEndIndex = -1;
  
  for (let i = 0; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
    
    if (cumulative > maxCumulative) {
      if (drawdownStartIndex >= 0) {
        const duration = i - drawdownStartIndex;
        if (duration > maxDrawdownDuration) {
          maxDrawdownDuration = duration;
          maxDrawdownDurationStartIndex = drawdownStartIndex;
          maxDrawdownDurationEndIndex = i;
        }
        drawdownStartIndex = -1;
      }
      maxCumulative = cumulative;
      maxCumulativeIndex = i;
    } else if (drawdownStartIndex < 0 && cumulative < maxCumulative) {
      drawdownStartIndex = maxCumulativeIndex;
    }
  }
  
  if (drawdownStartIndex >= 0) {
    const duration = dailyReturns.length - 1 - drawdownStartIndex;
    if (duration > maxDrawdownDuration) {
      maxDrawdownDuration = duration;
      maxDrawdownDurationStartIndex = drawdownStartIndex;
      maxDrawdownDurationEndIndex = dailyReturns.length - 1;
    }
  }
  
  if (maxDrawdownDurationStartIndex >= 0 && maxDrawdownDurationEndIndex >= 0) {
    let startCumulative = 1;
    for (let i = 0; i <= maxDrawdownDurationStartIndex; i++) {
      startCumulative *= (1 + dailyReturns[i]);
    }
    
    let minCumulative = startCumulative;
    let currentCumulative = startCumulative;
    for (let i = maxDrawdownDurationStartIndex + 1; i <= maxDrawdownDurationEndIndex; i++) {
      currentCumulative *= (1 + dailyReturns[i]);
      if (currentCumulative < minCumulative) {
        minCumulative = currentCumulative;
      }
    }
    
    if (startCumulative === 0) return 0;
    return (minCumulative / startCumulative) - 1;
  }
  
  return 0;
}

// 21. 1-month VaR (99%)
export function calculateMonthlyVaR(dailyReturns, dates, confidence) {
  const monthlyReturns = calculateMonthlyReturns(dailyReturns, dates);
  if (monthlyReturns.length === 0) return 0;
  const sorted = [...monthlyReturns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return sorted[Math.max(0, index)];
}

// 22. Gini Coefficient
export function calculateGiniCoefficient(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  
  const absReturns = dailyReturns.map(r => Math.abs(r));
  const sorted = [...absReturns].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  
  if (sum === 0) return 0;
  
  let lorenzArea = 0;
  let cumulativeSum = 0;
  for (let i = 0; i < n; i++) {
    cumulativeSum += sorted[i];
    lorenzArea += (cumulativeSum / sum) / n;
  }
  
  return 1 - 2 * lorenzArea;
}

// 23. Gain/Pain Ratio (1M)
export function calculateGainPainRatio(dailyReturns, dates) {
  const monthlyReturns = calculateMonthlyReturns(dailyReturns, dates);
  if (monthlyReturns.length === 0) return 0;
  
  let positiveSum = 0;
  let negativeSum = 0;
  
  for (const mr of monthlyReturns) {
    if (mr > 0) {
      positiveSum += mr;
    } else {
      negativeSum += Math.abs(mr);
    }
  }
  
  if (negativeSum === 0) return positiveSum > 0 ? Infinity : 0;
  return positiveSum / negativeSum;
}

// 24. Outlier Win Ratio
export function calculateOutlierWinRatio(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const p99 = sorted[Math.floor(0.99 * sorted.length)];
  const positiveOutliers = dailyReturns.filter(r => r > p99 && r > 0);
  return positiveOutliers.length / dailyReturns.length;
}

// 25. Outlier Loss Ratio
export function calculateOutlierLossRatio(dailyReturns) {
  if (dailyReturns.length === 0) return 0;
  const sorted = [...dailyReturns].sort((a, b) => a - b);
  const p1 = sorted[Math.floor(0.01 * sorted.length)];
  const negativeOutliers = dailyReturns.filter(r => r < p1 && r < 0);
  return negativeOutliers.length / dailyReturns.length;
}

// 26. Rolling Sharpe Stats
export function calculateRollingSharpeStats(dailyReturns, windowSize) {
  if (dailyReturns.length < windowSize) {
    return { mean: 0, median: 0, last: 0 };
  }
  
  const rollingSharpe = [];
  
  for (let i = windowSize - 1; i < dailyReturns.length; i++) {
    const window = dailyReturns.slice(i - windowSize + 1, i + 1);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / window.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) {
      rollingSharpe.push(0);
    } else {
      rollingSharpe.push((mean / stdDev) * Math.sqrt(252));
    }
  }
  
  if (rollingSharpe.length === 0) {
    return { mean: 0, median: 0, last: 0 };
  }
  
  const sorted = [...rollingSharpe].sort((a, b) => a - b);
  const mean = rollingSharpe.reduce((a, b) => a + b, 0) / rollingSharpe.length;
  const median = sorted[Math.floor(sorted.length / 2)];
  const last = rollingSharpe[rollingSharpe.length - 1];
  
  return { mean, median, last };
}

// 27. MTD (Month to Date)
export function calculateMTD(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let startIndex = -1;
  for (let i = dates.length - 1; i >= 0; i--) {
    let date;
    try {
      date = new Date(dates[i]);
      if (isNaN(date.getTime())) continue;
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        startIndex = i;
      } else if (startIndex >= 0) {
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  if (startIndex < 0) return 0;
  
  let cumulative = 1;
  for (let i = startIndex; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
  }
  
  return cumulative - 1;
}

// 28. Period Return (3M, 6M)
export function calculatePeriodReturn(dailyReturns, dates, days) {
  if (dailyReturns.length === 0) return 0;
  
  const startIndex = Math.max(0, dailyReturns.length - days);
  let cumulative = 1;
  for (let i = startIndex; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
  }
  
  return cumulative - 1;
}

// 29. YTD (Year to Date)
export function calculateYTD(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let startIndex = -1;
  for (let i = 0; i < dates.length; i++) {
    let date;
    try {
      date = new Date(dates[i]);
      if (isNaN(date.getTime())) continue;
      if (date.getFullYear() === currentYear) {
        startIndex = i;
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  if (startIndex < 0) return 0;
  
  let cumulative = 1;
  for (let i = startIndex; i < dailyReturns.length; i++) {
    cumulative *= (1 + dailyReturns[i]);
  }
  
  return cumulative - 1;
}

// 30. Best Year
export function calculateBestYear(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const yearlyData = {};
  
  for (let i = 0; i < dates.length && i < dailyReturns.length; i++) {
    let date;
    try {
      date = new Date(dates[i]);
      if (isNaN(date.getTime())) {
        const dateStr = dates[i];
        if (dateStr && dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts.length >= 1) {
            date = new Date(parseInt(parts[0]), 0, 1);
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } catch (e) {
      continue;
    }
    
    const year = date.getFullYear();
    if (!yearlyData[year]) {
      yearlyData[year] = [];
    }
    yearlyData[year].push(dailyReturns[i]);
  }
  
  const yearlyReturns = [];
  Object.keys(yearlyData).forEach(year => {
    const returns = yearlyData[year];
    if (returns.length > 0) {
      let yearlyReturn = 1;
      for (const dr of returns) {
        yearlyReturn *= (1 + dr);
      }
      yearlyReturns.push(yearlyReturn - 1);
    }
  });
  
  if (yearlyReturns.length === 0) return 0;
  return Math.max(...yearlyReturns);
}

// 31. Worst Year
export function calculateWorstYear(dailyReturns, dates) {
  if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
  
  const yearlyData = {};
  
  for (let i = 0; i < dates.length && i < dailyReturns.length; i++) {
    let date;
    try {
      date = new Date(dates[i]);
      if (isNaN(date.getTime())) {
        const dateStr = dates[i];
        if (dateStr && dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts.length >= 1) {
            date = new Date(parseInt(parts[0]), 0, 1);
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } catch (e) {
      continue;
    }
    
    const year = date.getFullYear();
    if (!yearlyData[year]) {
      yearlyData[year] = [];
    }
    yearlyData[year].push(dailyReturns[i]);
  }
  
  const yearlyReturns = [];
  Object.keys(yearlyData).forEach(year => {
    const returns = yearlyData[year];
    if (returns.length > 0) {
      let yearlyReturn = 1;
      for (const dr of returns) {
        yearlyReturn *= (1 + dr);
      }
      yearlyReturns.push(yearlyReturn - 1);
    }
  });
  
  if (yearlyReturns.length === 0) return 0;
  return Math.min(...yearlyReturns);
}
