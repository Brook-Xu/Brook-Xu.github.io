/**
 * Polygon.io API 服务
 * 用于获取市场数据
 */

import cacheManager from './cacheManager.js';

class PolygonApiService {
  constructor(apiKey) {
    this.apiKey = apiKey || 'W4SbxlOv3nWQv1EpM4EIK6gmuyiVYNhn';
    this.baseUrl = 'https://api.polygon.io/v2/aggs/ticker';
  }

  /**
   * 检查API Key是否已设置
   */
  isApiKeySet() {
    return this.apiKey && this.apiKey !== 'YOUR_POLYGON_API_KEY_HERE';
  }

  /**
   * 设置API Key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * 获取日期范围（最近30天）
   */
  getDateRange() {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      from: thirtyDaysAgo.toISOString().split('T')[0],
      to: yesterday.toISOString().split('T')[0]
    };
  }

  /**
   * 获取单个股票/加密货币数据
   * @param {string} ticker - 股票代码
   * @param {string} fromDate - 开始日期 (YYYY-MM-DD)
   * @param {string} toDate - 结束日期 (YYYY-MM-DD)
   * @param {boolean} useCache - 是否使用缓存，默认true
   */
  async fetchTickerData(ticker, fromDate, toDate, useCache = true) {
    if (!this.isApiKeySet()) {
      throw new Error('Please set your Polygon.io API key');
    }

    // 生成缓存参数
    const cacheParams = {
      ticker: ticker,
      fromDate: fromDate,
      toDate: toDate
    };

    // 尝试从缓存获取
    if (useCache) {
      const cached = cacheManager.get('polygon_ticker', cacheParams);
      if (cached !== null) {
        console.log(`Cache hit for Polygon ticker: ${ticker} (${fromDate} to ${toDate})`);
        return cached;
      }
    }

    const url = `${this.baseUrl}/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apikey=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 检查API状态 - 接受OK和DELAYED状态
      if (data.status !== 'OK' && data.status !== 'DELAYED') {
        throw new Error(`API error: ${data.message || 'Unknown error'}`);
      }
      
      // 缓存成功的结果
      if (useCache) {
        cacheManager.set('polygon_ticker', cacheParams, data);
        console.log(`Cached Polygon ticker data: ${ticker} (${fromDate} to ${toDate})`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
  }

  /**
   * 获取所有市场数据
   * @param {string} fromDate - 开始日期 (YYYY-MM-DD)，可选，默认最近30天
   * @param {string} toDate - 结束日期 (YYYY-MM-DD)，可选，默认昨天
   * @param {boolean} useCache - 是否使用缓存，默认true
   * @returns {Object} 包含所有市场数据的对象
   */
  async fetchAllMarketData(fromDate = null, toDate = null, useCache = true) {
    if (!this.isApiKeySet()) {
      throw new Error('Please set your Polygon.io API key');
    }

    // 如果提供了日期范围，使用提供的；否则使用默认的最近30天
    let from, to;
    if (fromDate && toDate) {
      from = fromDate;
      to = toDate;
    } else {
      const dateRange = this.getDateRange();
      from = dateRange.from;
      to = dateRange.to;
    }

    // 生成缓存参数
    const cacheParams = {
      fromDate: from,
      toDate: to
    };

    // 尝试从缓存获取完整结果
    if (useCache) {
      const cached = cacheManager.get('polygon_all', cacheParams);
      if (cached !== null) {
        console.log(`Cache hit for Polygon all market data (${from} to ${to})`);
        return cached;
      }
    }
    
    // 定义要获取的数据类型（仅股票/ETF，加密货币由 CoinGecko 提供）
    const tickers = {
      sp500: 'SPY',           // 标普500 ETF
      nasdaq: 'QQQ'           // 纳斯达克100 ETF
    };

    try {
      // 并行获取所有数据（内部会使用缓存）
      const promises = Object.entries(tickers).map(async ([key, ticker]) => {
        try {
          const data = await this.fetchTickerData(ticker, from, to, useCache);
          return { key, data, success: true };
        } catch (error) {
          console.error(`Failed to fetch ${key}:`, error);
          return { key, error: error.message, success: false };
        }
      });

      const results = await Promise.all(promises);
      
      // 组织返回数据
      const marketData = {};
      const errors = {};

      results.forEach(({ key, data, error, success }) => {
        if (success) {
          marketData[key] = data;
        } else {
          errors[key] = error;
        }
      });

      const result = {
        marketData,
        errors: Object.keys(errors).length > 0 ? errors : null,
        dateRange: { from, to }
      };

      // 缓存完整结果
      if (useCache) {
        cacheManager.set('polygon_all', cacheParams, result);
        console.log(`Cached Polygon all market data (${from} to ${to})`);
      }

      return result;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  }

  /**
   * 获取数据标题
   * @param {string} key - 数据键
   * @returns {string} 显示标题
   */
  getDataTitle(key) {
    const titles = {
      sp500: 'S&P 500 Index (SPY)',
      nasdaq: 'NASDAQ 100 (QQQ)'
    };
    return titles[key] || key.toUpperCase();
  }

  /**
   * 格式化数据用于显示
   * @param {Object} data - 原始API数据
   * @returns {Object} 格式化后的数据
   */
  formatDataForDisplay(data) {
    if (!data || !data.results) {
      return data;
    }

    const results = data.results;
    const latest = results[results.length - 1];
    const first = results[0];

    return {
      ticker: data.ticker,
      queryCount: data.queryCount,
      resultsCount: data.resultsCount,
      adjusted: data.adjusted,
      dateRange: {
        from: new Date(first.t).toISOString().split('T')[0],
        to: new Date(latest.t).toISOString().split('T')[0]
      },
      latest: {
        date: new Date(latest.t).toISOString().split('T')[0],
        open: latest.o,
        high: latest.h,
        low: latest.l,
        close: latest.c,
        volume: latest.v
      },
      priceChange: latest.c - first.c,
      priceChangePercent: ((latest.c - first.c) / first.c * 100).toFixed(2),
      allData: results.map(item => ({
        date: new Date(item.t).toISOString().split('T')[0],
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
        volume: item.v
      }))
    };
  }
}

// 创建默认实例
const polygonApi = new PolygonApiService();

export default polygonApi;
export { PolygonApiService };
