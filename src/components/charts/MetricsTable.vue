<template>
  <section ref="metricsSection" class="metrics-section" data-aos="fade-up">
    <h2>{{ $t('charts.metricsTitle') }}</h2>
    <div class="metrics-table-container">
      <table class="metrics-table">
        <thead>
          <tr>
            <th>{{ $t('charts.metrics.metric') }}</th>
            <th>{{ $t('charts.metrics.uploadedData') }}</th>
            <th>{{ $t('charts.metrics.sp500') }}</th>
            <th>{{ $t('charts.metrics.nasdaq') }}</th>
            <th>{{ $t('charts.metrics.btc') }}</th>
            <th>{{ $t('charts.metrics.eth') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="config in metricsConfig" :key="config.key">
            <td>{{ $t(`charts.metrics.${config.key}`) }}</td>
            <td>{{ getMetricValue(metrics, config.key, config.type, config.decimals) }}</td>
            <td>{{ getMetricValue(marketMetrics.sp500, config.key, config.type, config.decimals) }}</td>
            <td>{{ getMetricValue(marketMetrics.nasdaq, config.key, config.type, config.decimals) }}</td>
            <td>{{ getMetricValue(marketMetrics.btc, config.key, config.type, config.decimals) }}</td>
            <td>{{ getMetricValue(marketMetrics.eth, config.key, config.type, config.decimals) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="metrics-info">
        <p>{{ $t('charts.metrics.dataPoints') }}: {{ metrics.dataPoints }}</p>
        <p>{{ $t('charts.metrics.totalDays') }}: {{ metrics.totalDays }}</p>
        <p>{{ $t('charts.metrics.years') }}: {{ formatNumber(metrics.years, 2) }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MetricsTable',
  props: {
    metrics: {
      type: Object,
      required: true
    },
    marketMetrics: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 指标配置数组，用于生成表格行
    metricsConfig() {
      return [
        { key: 'startDate', type: 'date' },
        { key: 'endDate', type: 'date' },
        { key: 'cumulativeReturn', type: 'percentage' },
        { key: 'cagr', type: 'percentage' },
        { key: 'volatility', type: 'percentage' },
        { key: 'sharpeRatio', type: 'number', decimals: 3 },
        { key: 'sortinoRatio', type: 'number', decimals: 3 },
        { key: 'maxDrawdown', type: 'percentage' },
        { key: 'durationOfMD', type: 'days' },
        { key: 'maxDrawdownDuration', type: 'days' },
        { key: 'drawdownOfMDD', type: 'percentage' },
        { key: 'calmarRatio', type: 'number', decimals: 3 },
        { key: 'var95', type: 'percentage' },
        { key: 'var99Monthly', type: 'percentage' },
        { key: 'cvar95', type: 'percentage' },
        { key: 'cvar99', type: 'percentage' },
        { key: 'giniCoefficient', type: 'number', decimals: 3 },
        { key: 'omegaRatio', type: 'number', decimals: 3 },
        { key: 'gainPainRatio', type: 'number', decimals: 3 },
        { key: 'tailRatio', type: 'number', decimals: 3 },
        { key: 'outlierWinRatio', type: 'percentage' },
        { key: 'outlierLossRatio', type: 'percentage' },
        { key: 'rollingSharpe90dMean', type: 'number', decimals: 3 },
        { key: 'rollingSharpe90dMedian', type: 'number', decimals: 3 },
        { key: 'rollingSharpe90dLast', type: 'number', decimals: 3 },
        { key: 'rollingSharpe365dMean', type: 'number', decimals: 3 },
        { key: 'rollingSharpe365dMedian', type: 'number', decimals: 3 },
        { key: 'rollingSharpe365dLast', type: 'number', decimals: 3 },
        { key: 'mtd', type: 'percentage' },
        { key: 'return3M', type: 'percentage' },
        { key: 'return6M', type: 'percentage' },
        { key: 'ytd', type: 'percentage' },
        { key: 'bestDay', type: 'percentage' },
        { key: 'worstDay', type: 'percentage' },
        { key: 'bestMonth', type: 'percentage' },
        { key: 'worstMonth', type: 'percentage' },
        { key: 'bestYear', type: 'percentage' },
        { key: 'worstYear', type: 'percentage' },
        { key: 'skew', type: 'number', decimals: 3 },
        { key: 'kurtosis', type: 'number', decimals: 3 }
      ];
    }
  },
  methods: {
    // 格式化百分比
    formatPercentage(value) {
      if (value === null || value === undefined || isNaN(value)) return 'N/A';
      if (!isFinite(value)) return 'Infinity';
      return (value * 100).toFixed(2) + '%';
    },

    // 格式化数字
    formatNumber(value, decimals = 2) {
      if (value === null || value === undefined || isNaN(value)) return 'N/A';
      if (!isFinite(value)) return 'Infinity';
      return value.toFixed(decimals);
    },

    // 辅助方法：获取指标值（用于表格显示）
    getMetricValue(source, metricKey, type, decimals) {
      // 如果没有数据源，返回空字符串（空白）
      if (!source) return '';
      
      const value = source[metricKey];
      
      // 如果值为 null、undefined 或 NaN，返回空字符串（空白）
      if (value === null || value === undefined || (typeof value === 'number' && isNaN(value))) {
        return '';
      }
      
      // 根据类型格式化
      if (type === 'date') {
        // 日期类型不允许返回 N/A
        if (!value || value === 'N/A') {
          return '';
        }
        return value;
      } else if (type === 'days') {
        return value + ' ' + this.$t('charts.metrics.days');
      } else if (type === 'number') {
        return this.formatNumber(value, decimals || 3);
      } else if (type === 'percentage') {
        return this.formatPercentage(value);
      } else {
        return value;
      }
    }
  }
};
</script>

<style scoped>
.metrics-section {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.metrics-section h2 {
  text-align: center;
  color: #FFC000;
  margin-bottom: 30px;
  font-size: 2rem;
}

.metrics-table-container {
  overflow-x: auto;
}

.metrics-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(13, 27, 42, 0.5);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.metrics-table thead {
  background: rgba(255, 192, 0, 0.2);
}

.metrics-table th {
  padding: 15px 20px;
  text-align: left;
  color: #FFC000;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 2px solid rgba(255, 192, 0, 0.3);
}

.metrics-table td {
  padding: 12px 20px;
  color: #ccc;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
}

.metrics-table tbody tr:hover {
  background: rgba(255, 192, 0, 0.05);
  transition: background 0.3s;
}

.metrics-table tbody tr:last-child td {
  border-bottom: none;
}

.metrics-table td:first-child {
  color: #FFC000;
  font-weight: 500;
}

.metrics-table td:last-child {
  text-align: right;
  font-family: 'Courier New', monospace;
  color: #fff;
  font-weight: 600;
}

.metrics-info {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  padding: 15px;
  background: rgba(13, 27, 42, 0.3);
  border-radius: 5px;
  border: 1px solid rgba(255, 192, 0, 0.2);
}

.metrics-info p {
  color: #999;
  font-size: 14px;
  margin: 0;
}

.metrics-info p strong {
  color: #FFC000;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-table {
    font-size: 12px;
  }
  
  .metrics-table th,
  .metrics-table td {
    padding: 10px 12px;
  }
  
  .metrics-info {
    flex-direction: column;
    align-items: center;
  }
}
</style>
