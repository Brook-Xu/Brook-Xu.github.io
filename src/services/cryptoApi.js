/**
 * CoinGecko API 服务
 * 用于获取加密货币市场数据（BTC, ETH）
 * 免费接口，无需 API Key
 */

import cacheManager from './cacheManager.js';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const COINS = {
  btc: 'bitcoin',
  eth: 'ethereum'
};

/**
 * CoinGecko API 允许的 days 参数值
 */
const ALLOWED_DAYS = [1, 7, 14, 30, 90, 180, 365];

/**
 * 将天数向上取整到 CoinGecko API 允许的值
 * @param {number} days - 原始天数
 * @returns {number} 允许的 days 值（1, 7, 14, 30, 90, 180, 或 365）
 */
function normalizeDaysForCoinGecko(days) {
  // 如果是允许的标准值之一，直接返回
  if (ALLOWED_DAYS.includes(days)) {
    return days;
  }
  
  // 转换为数字
  const numDays = typeof days === 'number' ? days : parseInt(days, 10);
  
  // 向上取整到最接近的允许值
  if (numDays <= 1) {
    return 1;
  } else if (numDays <= 7) {
    return 7;
  } else if (numDays <= 14) {
    return 14;
  } else if (numDays <= 30) {
    return 30;
  } else if (numDays <= 90) {
    return 90;
  } else if (numDays <= 180) {
    return 180;
  } else {
    // 超过 365 天时，返回 365（最大允许值）
    return 365;
  }
}

/**
 * 获取单个加密货币的市场数据（包含 OHLC 和成交量）
 * @param {string} coinId - 加密货币 ID (bitcoin, ethereum)
 * @param {number} days - 天数，默认 30 天
 * @param {string} fromDate - 开始日期 (YYYY-MM-DD)，可选，用于过滤数据
 * @param {string} toDate - 结束日期 (YYYY-MM-DD)，可选，用于过滤数据
 * @param {boolean} useCache - 是否使用缓存，默认true
 * @returns {Promise<Array>} 市场数据数组
 */
async function fetchMarketData(coinId, days = 30, fromDate = null, toDate = null, useCache = true) {
  // 将天数标准化为 CoinGecko API 允许的值
  const normalizedDays = normalizeDaysForCoinGecko(days);
  
  // 生成缓存参数（使用标准化后的days值）
  const cacheParams = {
    coinId: coinId,
    days: normalizedDays,
    fromDate: fromDate || '',
    toDate: toDate || ''
  };

  // 尝试从缓存获取
  if (useCache) {
    const cached = cacheManager.get('coingecko_market', cacheParams);
    if (cached !== null) {
      console.log(`Cache hit for CoinGecko market data: ${coinId} (${normalizedDays} days, ${fromDate || 'N/A'} to ${toDate || 'N/A'})`);
      return cached;
    }
  }

  try {
    // 并行获取 OHLC 数据和市场数据（包含成交量）
    // 使用标准化后的 days 值
    const [ohlcRes, marketRes] = await Promise.all([
      fetch(`${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${normalizedDays}`),
      fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${normalizedDays}&interval=daily`)
    ]);

    if (!ohlcRes.ok) {
      throw new Error(`CoinGecko OHLC API error: ${ohlcRes.status} for ${coinId}`);
    }
    if (!marketRes.ok) {
      throw new Error(`CoinGecko Market API error: ${marketRes.status} for ${coinId}`);
    }

    const ohlcData = await ohlcRes.json();
    const marketData = await marketRes.json();

    // 创建成交量映射表（按时间戳）
    const volumeMap = new Map();
    if (marketData.total_volumes && Array.isArray(marketData.total_volumes)) {
      marketData.total_volumes.forEach(item => {
        // CoinGecko 返回的时间戳是秒，需要转换为毫秒
        const timestamp = item[0];
        const volume = item[1];
        volumeMap.set(timestamp, volume);
      });
    }

    // 合并 OHLC 和成交量数据
    let result = ohlcData.map(item => {
      const timestamp = item[0];
      // 查找对应的成交量（允许一定的时间误差，因为数据可能不完全对齐）
      let volume = null;
      if (volumeMap.has(timestamp)) {
        volume = volumeMap.get(timestamp);
      } else {
        // 尝试查找最接近的时间戳（±1天的误差）
        for (const [ts, vol] of volumeMap.entries()) {
          if (Math.abs(ts - timestamp) < 24 * 60 * 60 * 1000) {
            volume = vol;
            break;
          }
        }
      }

      return {
        t: timestamp,        // timestamp (毫秒)
        o: item[1],          // open
        h: item[2],          // high
        l: item[3],          // low
        c: item[4],          // close
        v: volume            // volume (从 market_chart 接口获取)
      };
    });

    // 如果提供了日期范围，过滤数据
    if (fromDate && toDate) {
      const fromTimestamp = new Date(fromDate + 'T00:00:00Z').getTime();
      const toTimestamp = new Date(toDate + 'T23:59:59Z').getTime();
      result = result.filter(item => {
        return item.t >= fromTimestamp && item.t <= toTimestamp;
      });
    }

    // 缓存结果
    if (useCache) {
      cacheManager.set('coingecko_market', cacheParams, result);
      console.log(`Cached CoinGecko market data: ${coinId} (${normalizedDays} days, ${fromDate || 'N/A'} to ${toDate || 'N/A'})`);
    }

    return result;
  } catch (error) {
    console.error(`Error fetching market data for ${coinId}:`, error);
    // 如果获取成交量失败，至少返回 OHLC 数据
    try {
      const ohlcRes = await fetch(`${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${normalizedDays}`);
      if (ohlcRes.ok) {
        const ohlcData = await ohlcRes.json();
        return ohlcData.map(item => ({
          t: item[0],
          o: item[1],
          h: item[2],
          l: item[3],
          c: item[4],
          v: null  // 成交量获取失败
        }));
      }
    } catch (fallbackError) {
      console.error(`Fallback OHLC fetch also failed for ${coinId}:`, fallbackError);
    }
    throw error;
  }
}

/**
 * 计算两个日期之间的天数，并向上取整到 CoinGecko API 允许的值
 * @param {string} fromDate - 开始日期 (YYYY-MM-DD)
 * @param {string} toDate - 结束日期 (YYYY-MM-DD)
 * @returns {number} 天数（已向上取整到 CoinGecko API 允许的值：1, 7, 14, 30, 90, 180, 或 365）
 */
function calculateDaysBetween(fromDate, toDate) {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const diffTime = Math.abs(to - from);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // 为了确保获取足够的数据，增加一些缓冲天数
  const daysWithBuffer = Math.max(diffDays + 5, 30); // 至少30天，确保有足够的数据
  // 标准化为 CoinGecko API 允许的值
  return normalizeDaysForCoinGecko(daysWithBuffer);
}

/**
 * 获取所有加密货币数据
 * @param {number} days - 天数，默认 30 天（当未提供日期范围时使用）
 * @param {string} fromDate - 开始日期 (YYYY-MM-DD)，可选
 * @param {string} toDate - 结束日期 (YYYY-MM-DD)，可选
 * @param {boolean} useCache - 是否使用缓存，默认true
 * @returns {Promise<Object>} 包含所有加密货币数据的对象
 */
export async function fetchAllCryptoData(days = 30, fromDate = null, toDate = null, useCache = true) {
  // 如果提供了日期范围，计算需要的天数
  let actualDays = normalizeDaysForCoinGecko(days); // 标准化默认天数
  let actualFromDate = fromDate;
  let actualToDate = toDate;

  if (fromDate && toDate) {
    // calculateDaysBetween 已经返回标准化后的值
    actualDays = calculateDaysBetween(fromDate, toDate);
  } else {
    // 如果没有提供日期范围，使用默认的最近N天
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    actualToDate = yesterday.toISOString().split('T')[0];
    actualFromDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    // 确保使用标准化后的天数
    actualDays = normalizeDaysForCoinGecko(days);
  }

  // 生成缓存参数（使用标准化后的days值）
  const cacheParams = {
    days: actualDays,
    fromDate: actualFromDate,
    toDate: actualToDate
  };

  // 尝试从缓存获取完整结果
  if (useCache) {
    const cached = cacheManager.get('coingecko_all', cacheParams);
    if (cached !== null) {
      console.log(`Cache hit for CoinGecko all crypto data (${actualFromDate} to ${actualToDate})`);
      return cached;
    }
  }

  const result = {};
  const errors = {};

  // 并行获取所有加密货币数据（内部会使用缓存）
  const promises = Object.entries(COINS).map(async ([key, coinId]) => {
    try {
      const data = await fetchMarketData(coinId, actualDays, actualFromDate, actualToDate, useCache);
      return { key, data, success: true };
    } catch (error) {
      console.error(`Failed to fetch ${key}:`, error);
      return { key, error: error.message, success: false };
    }
  });

  const results = await Promise.all(promises);

  // 组织返回数据
  results.forEach(({ key, data, error, success }) => {
    if (success) {
      result[key] = {
        ticker: COINS[key],
        results: data,
        resultsCount: data.length,
        queryCount: data.length,
        adjusted: true
      };
    } else {
      errors[key] = error;
    }
  });

  const finalResult = {
    marketData: result,
    errors: Object.keys(errors).length > 0 ? errors : null,
    dateRange: {
      from: actualFromDate,
      to: actualToDate
    }
  };

  // 缓存完整结果
  if (useCache) {
    cacheManager.set('coingecko_all', cacheParams, finalResult);
    console.log(`Cached CoinGecko all crypto data (${actualFromDate} to ${actualToDate})`);
  }

  return finalResult;
}

/**
 * 获取数据标题
 * @param {string} key - 数据键 (btc, eth)
 * @returns {string} 显示标题
 */
export function getCryptoDataTitle(key) {
  const titles = {
    btc: 'Bitcoin (BTC/USD)',
    eth: 'Ethereum (ETH/USD)'
  };
  return titles[key] || key.toUpperCase();
}

