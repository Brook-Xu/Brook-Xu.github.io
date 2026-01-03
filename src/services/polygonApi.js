/**
 * Polygon.io API 服务
 * 用于获取市场数据
 */

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
   */
  async fetchTickerData(ticker, fromDate, toDate) {
    if (!this.isApiKeySet()) {
      throw new Error('Please set your Polygon.io API key');
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
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
      throw error;
    }
  }

  /**
   * 获取所有市场数据
   * @returns {Object} 包含所有市场数据的对象
   */
  async fetchAllMarketData() {
    if (!this.isApiKeySet()) {
      throw new Error('Please set your Polygon.io API key');
    }

    const { from, to } = this.getDateRange();
    
    // 定义要获取的数据类型（仅股票/ETF，加密货币由 CoinGecko 提供）
    const tickers = {
      sp500: 'SPY',           // 标普500 ETF
      nasdaq: 'QQQ'           // 纳斯达克100 ETF
    };

    try {
      // 并行获取所有数据
      const promises = Object.entries(tickers).map(async ([key, ticker]) => {
        try {
          const data = await this.fetchTickerData(ticker, from, to);
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

      return {
        marketData,
        errors: Object.keys(errors).length > 0 ? errors : null,
        dateRange: { from, to }
      };
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
