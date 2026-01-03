/**
 * CoinGecko API 服务
 * 用于获取加密货币市场数据（BTC, ETH）
 * 免费接口，无需 API Key
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

const COINS = {
  btc: 'bitcoin',
  eth: 'ethereum'
};

/**
 * 获取单个加密货币的市场数据（包含 OHLC 和成交量）
 * @param {string} coinId - 加密货币 ID (bitcoin, ethereum)
 * @param {number} days - 天数，默认 30 天
 * @returns {Promise<Array>} 市场数据数组
 */
async function fetchMarketData(coinId, days = 30) {
  try {
    // 并行获取 OHLC 数据和市场数据（包含成交量）
    const [ohlcRes, marketRes] = await Promise.all([
      fetch(`${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`),
      fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`)
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
    return ohlcData.map(item => {
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
  } catch (error) {
    console.error(`Error fetching market data for ${coinId}:`, error);
    // 如果获取成交量失败，至少返回 OHLC 数据
    try {
      const ohlcRes = await fetch(`${BASE_URL}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`);
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
 * 获取所有加密货币数据
 * @param {number} days - 天数，默认 30 天
 * @returns {Promise<Object>} 包含所有加密货币数据的对象
 */
export async function fetchAllCryptoData(days = 30) {
  const result = {};
  const errors = {};

  // 并行获取所有加密货币数据
  const promises = Object.entries(COINS).map(async ([key, coinId]) => {
    try {
      const data = await fetchMarketData(coinId, days);
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

  return {
    marketData: result,
    errors: Object.keys(errors).length > 0 ? errors : null,
    dateRange: {
      from: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  };
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

