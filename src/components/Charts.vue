<template>
  <div class="charts-container">
    <!-- Upload Section -->
    <section class="upload-section" data-aos="fade-up">
      <h2>{{ $t('charts.uploadSection') }}</h2>
      <div class="upload-area">
        <input type="file" @change="handleFileUpload" accept=".csv" />
        <p class="upload-hint">{{ $t('charts.uploadHint') }}</p>
        <div class="file-requirements">
          <h4>{{ $t('charts.fileRequirements') }}</h4>
          <ul>
            <li>{{ $t('charts.csvOnly') }}</li>
            <li>{{ $t('charts.firstColumnDate') }}</li>
            <li>{{ $t('charts.secondColumnValue') }}</li>
            <li>{{ $t('charts.autoDetect') }}</li>
          </ul>
          <h5>{{ $t('charts.supportedFormats') }}</h5>
          <ul>
            <li v-for="format in $t('charts.dateFormats')" :key="format">{{ format }}</li>
          </ul>
          <h5>{{ $t('charts.supportedColumns') }}</h5>
          <ul>
            <li>{{ $t('charts.columnNames.date') }}</li>
            <li>{{ $t('charts.columnNames.value') }}</li>
          </ul>
        </div>
      </div>
      <div v-if="errorMessage" class="error-message">
        <h3>{{ $t('common.error') }}</h3>
        <p>{{ errorMessage }}</p>
      </div>
    </section>

    <section class="charts" data-aos="fade-up">
      <h2>{{ $t('charts.title') }}</h2>
      <div v-if="!chartData || chartData.length === 0" class="no-data">
        <p>{{ $t('charts.noDataMessage') }}</p>
      </div>
      <div v-else>
        <div ref="chart" class="chart-container"></div>
        <div class="chart-info">
          <p>{{ $t('charts.totalDataPoints') }}: {{ chartData.length }}</p>
          <p>{{ $t('home.dateRange') }}: {{ dateRange }}</p>
        </div>
      </div>
    </section>

    <!-- API Market Data Section -->
    <div v-if="apiError" class="error-message">
      <h3>{{ $t('home.apiError') }}</h3>
      <p>{{ apiError }}</p>
    </div>
    
    <div v-if="marketData" class="market-data-display">
      <h3>{{ $t('home.marketDataCharts') }}</h3>
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
import Papa from 'papaparse';

export default {
  name: 'Charts',
  data() {
    return {
      chartData: null,
      chart: null,
      marketData: null,
      apiError: null,
      parsedData: null,
      errorMessage: null
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
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.parsedData = null;
        this.errorMessage = null;
        return;
      }

      // 检查文件类型
      if (!file.name.toLowerCase().endsWith('.csv')) {
        this.errorMessage = this.$t('charts.selectCsvFile');
        this.parsedData = null;
        return;
      }

      this.errorMessage = null;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            this.parseCSVData(results.data);
          } catch (error) {
            this.errorMessage = this.$t('charts.errorParsingCsv') + ': ' + error.message;
            this.parsedData = null;
          }
        },
        error: (error) => {
          this.errorMessage = this.$t('charts.errorReadingCsv') + ': ' + error.message;
          this.parsedData = null;
        }
      });
    },

    parseCSVData(data) {
      // 验证数据结构
      if (!data || data.length === 0) {
        throw new Error(this.$t('charts.csvEmpty'));
      }

      // 智能检测列名
      const firstRow = data[0];
      const columnNames = Object.keys(firstRow);
      
      if (columnNames.length < 2) {
        throw new Error(this.$t('charts.csvMinColumns'));
      }

      // 查找日期列（第一列或包含日期关键词的列）
      let dateColumn = null;
      let valueColumn = null;

      // 优先检查第一列是否为日期
      const firstColumnName = columnNames[0];
      const firstColumnValue = firstRow[firstColumnName];
      if (this.isDateColumn(firstColumnValue)) {
        dateColumn = firstColumnName;
        valueColumn = columnNames[1]; // 第二列作为数值列
      } else {
        // 如果第一列不是日期，尝试查找包含日期关键词的列
        for (const colName of columnNames) {
          if (this.isDateColumnName(colName)) {
            dateColumn = colName;
            break;
          }
        }
        
        // 查找数值列
        for (const colName of columnNames) {
          if (colName !== dateColumn && this.isValueColumnName(colName)) {
            valueColumn = colName;
            break;
          }
        }
        
        // 如果没找到明确的列名，使用第一列作为日期，第二列作为数值
        if (!dateColumn) {
          dateColumn = columnNames[0];
        }
        if (!valueColumn) {
          valueColumn = columnNames[1];
        }
      }

      // 验证找到的列
      if (!dateColumn || !valueColumn) {
        throw new Error(this.$t('charts.cannotIdentifyColumns'));
      }

      // 解析数据
      const parsedData = data.map((row, index) => {
        const dateStr = row[dateColumn];
        const valueStr = row[valueColumn];

        // 验证日期格式 (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          throw new Error(this.$t('charts.invalidDateFormat', { row: index + 2, date: dateStr }));
        }

        // 验证数值
        const value = parseFloat(valueStr);
        if (isNaN(value)) {
          throw new Error(this.$t('charts.invalidValue', { row: index + 2, value: valueStr }));
        }

        return {
          date: dateStr,
          value: value
        };
      });

      this.parsedData = parsedData;
      this.chartData = parsedData;
      
      // 解析成功后获取API数据
      this.fetchMarketDataAndUpdateCharts(parsedData);
    },

    async fetchMarketDataAndUpdateCharts(csvData) {
      try {
        const result = await polygonApi.fetchAllMarketData();
        
        if (result.errors) {
          console.warn('Some data failed to load:', result.errors);
        }
        
        this.marketData = result.marketData;
        this.apiError = result.errors ? 'Some market data failed to load' : null;

        // 更新图表
        this.$nextTick(() => {
          this.initChart();
          this.renderMarketCharts();
        });

      } catch (error) {
        console.error('Error fetching market data:', error);
        this.apiError = error.message;
        
        // 即使API失败，也要显示CSV数据图表
        this.$nextTick(() => {
          this.initChart();
        });
      }
    },

    isDateColumn(value) {
      if (!value) return false;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      return dateRegex.test(value);
    },

    isDateColumnName(columnName) {
      if (!columnName) return false;
      const dateKeywords = ['date', 'time', 'timestamp', 'day', 'month', 'year', '日期', '时间'];
      const lowerName = columnName.toLowerCase();
      return dateKeywords.some(keyword => lowerName.includes(keyword));
    },

    isValueColumnName(columnName) {
      if (!columnName) return false;
      const valueKeywords = ['value', 'price', 'amount', 'quantity', 'count', 'number', '数值', '价格'];
      const lowerName = columnName.toLowerCase();
      return valueKeywords.some(keyword => lowerName.includes(keyword));
    },

    initChart() {
      if (!this.$refs.chart) return;
      
      this.chart = echarts.init(this.$refs.chart);
      
      // 准备数据
      const dates = this.chartData.map(item => item.date);
      const values = this.chartData.map(item => item.value);
      
      const option = {
        title: {
          text: this.$t('charts.dataTrendChart'),
          left: 'center',
          textStyle: {
            color: '#FFC000',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('tooltips.date', { date: data.axisValue })}<br/>${this.$t('tooltips.value', { value: data.value })}`;
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
          name: this.$t('charts.value'),
          type: 'line',
          data: values,
          smooth: true,
          lineStyle: {
            color: '#FFC000',
            width: 2
          },
          itemStyle: {
            color: '#FFC000'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(255, 192, 0, 0.3)'
              }, {
                offset: 1, color: 'rgba(255, 192, 0, 0.1)'
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
            text: this.$t('home.noDataAvailable'),
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
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' },
          formatter: (params) => {
            let result = `${this.$t('tooltips.date', { date: params[0].axisValue })}<br/>`;
            params.forEach(param => {
              if (param.seriesName === this.$t('home.volume')) {
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
            name: this.$t('tooltips.price', { price: '' }).replace('${price}', ''),
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
            name: this.$t('home.volume'),
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
              color: '#FFC000'
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
          name: this.$t('home.volume'), 
          data: volumeData, 
          type: 'bar', 
          yAxisIndex: 1, 
          itemStyle: { color: '#ff6b6b' },
          barWidth: '60%'
        },
        { 
          name: this.$t('home.open'), 
          data: results.map(item => item.o), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#FFC000' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: this.$t('home.high'), 
          data: results.map(item => item.h), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ffa726' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: this.$t('home.low'), 
          data: results.map(item => item.l), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ef5350' },
          lineStyle: { width: 2 },
          symbol: 'circle',
          symbolSize: 4
        },
        { 
          name: this.$t('home.close'), 
          data: results.map(item => item.c), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#42a5f5' },
          lineStyle: { width: 3 },
          symbol: 'circle',
          symbolSize: 5
        },
        { 
          name: this.$t('home.vwap'), 
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
  padding: 100px 20px 0 20px; /* 添加顶部边距，避免导航栏遮盖内容 */
}

.charts {
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.charts h2 {
  text-align: center;
  color: #FFC000;
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
  background: #FFC000;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.back-link:hover {
  background: #FFD700;
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
  color: #FFC000;
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
  color: #FFC000;
  margin-bottom: 20px;
  font-size: 1.2rem;
  text-align: center;
  border-bottom: 2px solid #FFC000;
  padding-bottom: 10px;
}

.chart-item .chart-container {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
}

/* Upload Section Styles */
.upload-section {
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.upload-section h2 {
  text-align: center;
  color: #FFC000;
  margin-bottom: 30px;
  font-size: 2rem;
}

.upload-area {
  text-align: center;
  margin-bottom: 30px;
}

.upload-area input[type="file"] {
  background: #333;
  color: #eee;
  padding: 10px 20px;
  border: 2px dashed #FFC000;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.upload-area input[type="file"]:hover {
  border-color: #FFD700;
  background: #444;
}

.upload-hint {
  color: #ccc;
  margin-top: 10px;
  font-size: 14px;
}

.file-requirements {
  margin-top: 20px;
  text-align: left;
  background: #1a1a1a;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #444;
}

.file-requirements h4 {
  color: #FFC000;
  margin-bottom: 10px;
  font-size: 16px;
}

.file-requirements h5 {
  color: #FFC000;
  margin: 15px 0 10px 0;
  font-size: 14px;
}

.file-requirements ul {
  color: #ccc;
  margin: 0;
  padding-left: 20px;
}

.file-requirements li {
  margin-bottom: 5px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .charts-container {
    padding: 80px 15px 0 15px; /* 移动端减少顶部边距 */
  }
}

@media (max-width: 480px) {
  .charts-container {
    padding: 70px 10px 0 10px; /* 小屏幕进一步减少顶部边距 */
  }
}

</style>
