<template>
  <div class="home-container">
    <section class="hero" data-aos="fade-up">
      <h1>Welcome to STARNET DIGITAL</h1>
      <p>Upload your data. Generate charts. Export reports.</p>
    </section>
    
    <section class="upload-section" data-aos="fade-up">
      <h2>Upload CSV File</h2>
      <div class="upload-area">
        <input type="file" @change="handleFileUpload" accept=".csv" />
        <p class="upload-hint">Please select a CSV file to upload</p>
        <div class="file-requirements">
          <h4>File Requirements:</h4>
          <ul>
            <li>Only CSV files are supported</li>
            <li>First column: date (YYYY-MM-DD format)</li>
            <li>Second column: value (numeric)</li>
            <li>First row should contain headers: "date" and "value"</li>
          </ul>
        </div>
      </div>
      <div v-if="errorMessage" class="error-message">
        <h3>Error</h3>
        <p>{{ errorMessage }}</p>
      </div>
      <div v-if="parsedData" class="data-preview">
        <h3>Parsed Data (JSON Format)</h3>
        <pre>{{ JSON.stringify(parsedData, null, 2) }}</pre>
      </div>
    </section>

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
import Papa from 'papaparse';
import polygonApi from '../services/polygonApi';
import * as echarts from 'echarts';

export default {
  data() {
    return { 
      parsedData: null,
      errorMessage: null,
      marketData: null,
      apiError: null
    };
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
        this.errorMessage = 'Please select a CSV file only.';
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
            this.errorMessage = 'Error parsing CSV file: ' + error.message;
            this.parsedData = null;
          }
        },
        error: (error) => {
          this.errorMessage = 'Error reading CSV file: ' + error.message;
          this.parsedData = null;
        }
      });
    },

    parseCSVData(data) {
      // 验证数据结构
      if (!data || data.length === 0) {
        throw new Error('CSV file is empty or invalid');
      }

      // 检查列名
      const firstRow = data[0];
      if (!firstRow.hasOwnProperty('date') || !firstRow.hasOwnProperty('value')) {
        throw new Error('CSV file must have "date" and "value" columns');
      }

      // 解析数据
      const parsedData = data.map((row, index) => {
        const dateStr = row.date;
        const valueStr = row.value;

        // 验证日期格式 (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
          throw new Error(`Invalid date format at row ${index + 2}: "${dateStr}". Expected format: YYYY-MM-DD`);
        }

        // 验证数值
        const value = parseFloat(valueStr);
        if (isNaN(value)) {
          throw new Error(`Invalid value at row ${index + 2}: "${valueStr}". Must be a number`);
        }

        return {
          date: dateStr,
          value: value
        };
      });

      this.parsedData = parsedData;
      
      // 解析成功后获取API数据，然后跳转
      this.fetchMarketDataAndNavigate(parsedData);
    },

    async fetchMarketDataAndNavigate(csvData) {
      try {
        const result = await polygonApi.fetchAllMarketData();
        
        if (result.errors) {
          console.warn('Some data failed to load:', result.errors);
        }
        
        // 跳转到Charts页面，同时传递CSV数据和API数据
        this.$router.push({
          name: 'Charts',
          params: { 
            data: csvData,
            marketData: result.marketData,
            apiError: result.errors ? 'Some market data failed to load' : null
          }
        });

      } catch (error) {
        console.error('Error fetching market data:', error);
        // 即使API失败，也要跳转到Charts页面显示CSV数据
        this.$router.push({
          name: 'Charts',
          params: { 
            data: csvData,
            marketData: null,
            apiError: error.message
          }
        });
      }
    },

    async fetchMarketData() {
      this.apiError = null;
      this.marketData = null;

      try {
        const result = await polygonApi.fetchAllMarketData();
        
        if (result.errors) {
          console.warn('Some data failed to load:', result.errors);
        }
        
        this.marketData = result.marketData;
        
        // 渲染图表
        this.$nextTick(() => {
          this.renderCharts();
        });

      } catch (error) {
        this.apiError = error.message;
        console.error('Error fetching market data:', error);
      }
    },

    getDataTitle(key) {
      return polygonApi.getDataTitle(key);
    },

    // 渲染图表
    renderCharts() {
      if (!this.marketData) return;

      Object.keys(this.marketData).forEach(key => {
        this.$nextTick(() => {
          this.renderChart(key, this.marketData[key]);
        });
      });
    },

    // 渲染单个图表
    renderChart(key, data) {
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
      const series = this.createChartSeries(data.results);

      const option = {
        title: {
          text: this.getDataTitle(key),
          left: 'center',
          textStyle: { color: '#42b983', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'cross' }
        },
        legend: {
          data: series.map(s => s.name),
          top: 30,
          textStyle: { color: '#ccc' }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dates,
          axisLabel: { 
            color: '#ccc',
            rotate: 45
          },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: series.map((s, index) => ({
          type: 'value',
          name: s.name,
          position: index === 0 ? 'left' : 'right',
          axisLabel: { color: '#ccc' },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { 
            lineStyle: { color: '#333' },
            show: index === 0
          }
        })),
        series: series
      };

      chart.setOption(option);

      // 响应式调整
      window.addEventListener('resize', () => {
        chart.resize();
      });
    },

    // 创建图表系列数据
    createChartSeries(results) {
      const series = [
        { name: 'Volume', data: results.map(item => item.v), type: 'bar', yAxisIndex: 1, itemStyle: { color: '#ff6b6b' } },
        { name: 'Open', data: results.map(item => item.o), type: 'line', yAxisIndex: 0, itemStyle: { color: '#42b983' } },
        { name: 'High', data: results.map(item => item.h), type: 'line', yAxisIndex: 0, itemStyle: { color: '#ffa726' } },
        { name: 'Low', data: results.map(item => item.l), type: 'line', yAxisIndex: 0, itemStyle: { color: '#ef5350' } },
        { name: 'Close', data: results.map(item => item.c), type: 'line', yAxisIndex: 0, itemStyle: { color: '#42a5f5' } },
        { name: 'VWAP', data: results.map(item => item.vw), type: 'line', yAxisIndex: 0, itemStyle: { color: '#ab47bc' } }
      ];

      return series;
    }
  }
};
</script>

<style>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  text-align: center;
  padding: 100px 20px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #42b983;
}

.hero p {
  font-size: 1.2rem;
  color: #ccc;
}

.upload-section {
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.upload-section h2 {
  text-align: center;
  color: #42b983;
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
  border: 2px dashed #42b983;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.upload-hint {
  margin-top: 10px;
  color: #999;
  font-size: 14px;
}

.file-requirements {
  margin-top: 20px;
  text-align: left;
  background: #1a1a1a;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #333;
}

.file-requirements h4 {
  color: #42b983;
  margin-bottom: 10px;
  font-size: 16px;
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

.data-preview {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #333;
}

.data-preview h3 {
  color: #42b983;
  margin-bottom: 15px;
}

.data-preview pre {
  background: #000;
  color: #0f0;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.4;
}

/* API数据展示区域样式 */
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

.chart-container {
  width: 100%;
  height: 400px;
  background: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .api-data-section {
    padding: 20px;
  }
  
  .fetch-button {
    width: 100%;
    padding: 15px;
  }
}
</style>
