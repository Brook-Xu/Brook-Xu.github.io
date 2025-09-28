<template>
  <div class="charts-container">
    <section class="charts" data-aos="fade-up">
      <h2>CSV Data Visualization Chart</h2>
      <div v-if="!chartData || chartData.length === 0" class="no-data">
        <p>No data available. Please upload a CSV file from the home page.</p>
        <router-link to="/" class="back-link">Go to Home</router-link>
      </div>
      <div v-else>
        <div ref="chart" class="chart-container"></div>
        <div class="chart-info">
          <p>Total data points: {{ chartData.length }}</p>
          <p>Date range: {{ dateRange }}</p>
        </div>
      </div>
    </section>

    <!-- API Market Data Section -->
    <div v-if="apiError" class="error-message">
      <h3>API Error</h3>
      <p>{{ apiError }}</p>
    </div>
    
    <div v-if="marketData" class="market-data-display">
      <h3>Market Data Charts</h3>
      <div class="charts-grid">
        <div v-for="(data, key) in marketData" :key="key" class="chart-item">
          <h4>{{ getDataTitle(key) }}</h4>
          <div :ref="`chart-${key}`" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import polygonApi from '../services/polygonApi';

export default {
  name: 'Charts',
  data() {
    return {
      chartData: null,
      chart: null,
      marketData: null,
      apiError: null
    };
  },
  computed: {
    dateRange() {
      if (!this.chartData || this.chartData.length === 0) return '';
      const dates = this.chartData.map(item => item.date).sort();
      return `${dates[0]} to ${dates[dates.length - 1]}`;
    }
  },
  mounted() {
    // 从路由参数获取数据
    this.chartData = this.$route.params.data;
    this.marketData = this.$route.params.marketData;
    this.apiError = this.$route.params.apiError;
    
    if (this.chartData && this.chartData.length > 0) {
      this.$nextTick(() => {
        this.initChart();
      });
    }
    
    // 渲染API数据图表
    if (this.marketData) {
      this.$nextTick(() => {
        this.renderMarketCharts();
      });
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.chart) return;
      
      this.chart = echarts.init(this.$refs.chart);
      
      // 准备数据
      const dates = this.chartData.map(item => item.date);
      const values = this.chartData.map(item => item.value);
      
      const option = {
        title: {
          text: 'Data Trend Chart',
          left: 'center',
          textStyle: {
            color: '#42b983',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const data = params[0];
            return `Date: ${data.axisValue}<br/>Value: ${data.value}`;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: {
            rotate: 45,
            color: '#ccc'
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#ccc'
          },
          axisLine: {
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        series: [{
          name: 'Value',
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            color: '#42b983',
            width: 2
          },
          itemStyle: {
            color: '#42b983'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(66, 185, 131, 0.3)'
              }, {
                offset: 1, color: 'rgba(66, 185, 131, 0.1)'
              }]
            }
          }
        }]
      };
      
      this.chart.setOption(option);
      
      // 响应式调整
      window.addEventListener('resize', () => {
        if (this.chart) {
          this.chart.resize();
        }
      });
    },

    // 渲染API市场数据图表
    renderMarketCharts() {
      if (!this.marketData) return;

      Object.keys(this.marketData).forEach(key => {
        this.$nextTick(() => {
          this.renderMarketChart(key, this.marketData[key]);
        });
      });
    },

    // 渲染单个市场数据图表
    renderMarketChart(key, data) {
      const chartRef = this.$refs[`chart-${key}`];
      if (!chartRef || !chartRef[0]) return;

      const chart = echarts.init(chartRef[0]);
      
      if (!data.results || data.results.length === 0) {
        chart.setOption({
          title: {
            text: 'No Data Available',
            left: 'center',
            top: 'middle',
            textStyle: { color: '#999' }
          }
        });
        return;
      }

      // 处理数据
      const dates = data.results.map(item => new Date(item.t).toLocaleDateString());
      const chartConfig = this.createMarketChartSeries(data.results);
      const series = chartConfig.series;
      const yAxisConfig = chartConfig.yAxisConfig;

      const option = {
        title: {
          text: this.getDataTitle(key),
          left: 'center',
          textStyle: { color: '#42b983', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: function(params) {
            let result = `Date: ${params[0].axisValue}<br/>`;
            params.forEach(param => {
              if (param.seriesName === 'Volume') {
                result += `${param.seriesName}: ${param.value.toLocaleString()}<br/>`;
              } else {
                result += `${param.seriesName}: $${param.value.toFixed(2)}<br/>`;
              }
            });
            return result;
          }
        },
        legend: {
          data: series.map(s => s.name),
          top: 30,
          textStyle: { color: '#ccc' },
          type: 'scroll'
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '8%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { 
            color: '#ccc',
            rotate: 45,
            fontSize: 10
          },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { show: false }
        },
        yAxis: [
          {
            type: 'value',
            name: 'Price ($)',
            position: 'left',
            min: yAxisConfig.price.min,
            max: yAxisConfig.price.max,
            axisLabel: { 
              color: '#ccc',
              formatter: function(value) {
                return '$' + value.toFixed(2);
              }
            },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { 
              lineStyle: { color: '#333' },
              show: true
            }
          },
          {
            type: 'value',
            name: 'Volume',
            position: 'right',
            min: yAxisConfig.volume.min,
            max: yAxisConfig.volume.max,
            axisLabel: { 
              color: '#ccc',
              formatter: function(value) {
                if (value >= 1e6) {
                  return (value / 1e6).toFixed(1) + 'M';
                } else if (value >= 1e3) {
                  return (value / 1e3).toFixed(1) + 'K';
                }
                return value.toLocaleString();
              }
            },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { show: false }
          }
        ],
        series: series,
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
            height: 20,
            bottom: 10,
            handleStyle: {
              color: '#42b983'
            },
            textStyle: {
              color: '#ccc'
            }
          }
        ]
      };

      chart.setOption(option);

      // 响应式调整
      window.addEventListener('resize', () => {
        chart.resize();
      });
    },

    // 创建市场数据图表系列
    createMarketChartSeries(results) {
      // 计算每个属性的数值范围
      const volumeData = results.map(item => item.v);
      const priceData = results.map(item => [item.o, item.h, item.l, item.c, item.vw]).flat();
      
      const volumeMin = Math.min(...volumeData);
      const volumeMax = Math.max(...volumeData);
      const priceMin = Math.min(...priceData);
      const priceMax = Math.max(...priceData);
      
      // 为价格数据添加一些边距，让图表更美观
      const priceRange = priceMax - priceMin;
      const pricePadding = priceRange * 0.05; // 5%的边距
      const adjustedPriceMin = priceMin - pricePadding;
      const adjustedPriceMax = priceMax + pricePadding;
      
      // 为成交量数据添加边距
      const volumeRange = volumeMax - volumeMin;
      const volumePadding = volumeRange * 0.1; // 10%的边距
      const adjustedVolumeMin = Math.max(0, volumeMin - volumePadding);
      const adjustedVolumeMax = volumeMax + volumePadding;

      const series = [
        { 
          name: 'Volume', 
          data: volumeData, 
          type: 'bar', 
          yAxisIndex: 1, 
          itemStyle: { color: '#ff6b6b' },
          barWidth: '60%'
        },
        { 
          name: 'Open', 
          data: results.map(item => item.o), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#42b983' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: 'High', 
          data: results.map(item => item.h), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ffa726' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: 'Low', 
          data: results.map(item => item.l), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ef5350' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: 'Close', 
          data: results.map(item => item.c), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#42a5f5' },
          lineStyle: { width: 3 },
          symbol: 'circle',
          symbolSize: 5
        },
        { 
          name: 'VWAP', 
          data: results.map(item => item.vw), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ab47bc' },
          lineStyle: { width: 2, type: 'dashed' },
          symbol: 'diamond',
          symbolSize: 4
        }
      ];

      return {
        series,
        yAxisConfig: {
          price: { min: adjustedPriceMin, max: adjustedPriceMax },
          volume: { min: adjustedVolumeMin, max: adjustedVolumeMax }
        }
      };
    },

    // 获取数据标题
    getDataTitle(key) {
      return polygonApi.getDataTitle(key);
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    window.removeEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize();
      }
    });
  }
};
</script>

<style scoped>
.charts-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.charts {
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.charts h2 {
  text-align: center;
  color: #42b983;
  margin-bottom: 30px;
  font-size: 2rem;
}

.chart-container {
  width: 100%;
  height: 500px;
  background: #1a1a1a;
  border-radius: 5px;
  padding: 20px;
}

.no-data {
  text-align: center;
  padding: 60px 20px;
  color: #ccc;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
}

.back-link {
  display: inline-block;
  background: #42b983;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.back-link:hover {
  background: #66d9a3;
}

.chart-info {
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.chart-info p {
  margin: 5px 0;
}

/* API Market Data Styles */
.error-message {
  background: #2d1b1b;
  border: 1px solid #c53;
  padding: 20px;
  border-radius: 5px;
  margin: 20px 0;
}

.error-message h3 {
  color: #c53;
  margin-bottom: 10px;
  font-size: 18px;
}

.error-message p {
  color: #ff6b6b;
  margin: 0;
  font-size: 14px;
}

.market-data-display {
  margin-top: 40px;
}

.market-data-display h3 {
  color: #42b983;
  margin-bottom: 20px;
  font-size: 1.5rem;
  text-align: center;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-top: 20px;
}

.chart-item {
  background: #2a2a2a;
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #444;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.chart-item h4 {
  color: #42b983;
  margin-bottom: 20px;
  font-size: 1.2rem;
  text-align: center;
  border-bottom: 2px solid #42b983;
  padding-bottom: 10px;
}

.chart-item .chart-container {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
}
</style>
