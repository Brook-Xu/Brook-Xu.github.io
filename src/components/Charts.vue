<template>
  <div class="charts-container">
    <!-- Upload Section -->
    <section class="upload-section" data-aos="fade-up">
      <h2>{{ $t('charts.uploadSection') }}</h2>
      <div class="upload-area">
        <input type="file" @change="handleFileUpload" accept=".csv,.xls,.xlsx" />
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

    <!-- Metrics Table Section -->
    <section v-if="metrics" class="metrics-section" data-aos="fade-up">
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

    <!-- Analysis Charts Section -->
    <section v-if="metrics && chartData" class="analysis-charts-section" data-aos="fade-up">
      <h2>{{ $t('charts.analysisChartsTitle') }}</h2>
      
      <!-- Chart 1: Cumulative Returns -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.cumulativeReturns') }}</h3>
        <div ref="cumulativeReturnsChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 2: Drawdown -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.drawdown') }}</h3>
        <div ref="drawdownChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 3: Rolling Sharpe -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.rollingSharpe') }}</h3>
        <div ref="rollingSharpeChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 4: Monthly Returns Heatmap -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.monthlyReturns') }}</h3>
        <div ref="monthlyReturnsChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 5: Yearly Returns -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.yearlyReturns') }}</h3>
        <div ref="yearlyReturnsChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 6: Return Distribution -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.returnDistribution') }}</h3>
        <div ref="returnDistributionChart" class="analysis-chart-container"></div>
      </div>

      <!-- Chart 7: Rolling Volatility -->
      <div class="analysis-chart-item">
        <h3>{{ $t('charts.analysisCharts.rollingVolatility') }}</h3>
        <div ref="rollingVolatilityChart" class="analysis-chart-container"></div>
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
import { fetchAllCryptoData, getCryptoDataTitle } from '../services/cryptoApi';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default {
  name: 'Charts',
  data() {
    return {
      chartData: null,
      chart: null,
      marketData: null,
      apiError: null,
      parsedData: null,
      errorMessage: null,
      rawData: null, // 保存原始数据，用于指标计算
      metrics: null, // 保存计算后的指标
      marketMetrics: {}, // 保存市场数据的指标 { sp500: {...}, nasdaq: {...}, btc: {...}, eth: {...} }
      dailyReturns: [], // 保存日收益率数组
      dates: [], // 保存日期数组（与 dailyReturns 一一对应）
      originalDates: [], // 保存原始日期数组（用于 startDate/endDate，特别是从 cumulative_return 反推时）
      analysisCharts: {
        cumulativeReturns: null,
        drawdown: null,
        rollingSharpe: null,
        monthlyReturns: null,
        yearlyReturns: null,
        returnDistribution: null,
        rollingVolatility: null
      }
    };
  },
  computed: {
    dateRange() {
      if (!this.chartData || this.chartData.length === 0) return '';
      const dates = this.chartData.map(item => item.date).sort();
      return `${dates[0]} to ${dates[dates.length - 1]}`;
    },
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

      const fileName = file.name.toLowerCase();
      this.errorMessage = null;

      // 检查文件类型
      if (fileName.endsWith('.csv')) {
        // 处理 CSV 文件
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
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // 处理 Excel 文件
        this.parseExcelFile(file);
      } else {
        this.errorMessage = this.$t('charts.selectSupportedFile');
        this.parsedData = null;
        return;
      }
    },

    parseExcelFile(file) {
      const reader = new FileReader();
      
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 检查是否有工作表
          if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error(this.$t('charts.excelNoSheets'));
          }
          
          // 使用第一个工作表
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // 将工作表转换为 JSON 对象数组
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: '', // 空单元格的默认值
            raw: false  // 将数字和日期转换为字符串
          });
          
          if (!jsonData || jsonData.length === 0) {
            throw new Error(this.$t('charts.excelEmpty'));
          }
          
          // 使用与 CSV 相同的解析逻辑
          this.parseCSVData(jsonData);
        } catch (error) {
          this.errorMessage = this.$t('charts.errorParsingExcel') + ': ' + error.message;
          this.parsedData = null;
        }
      };
      
      reader.onerror = () => {
        this.errorMessage = this.$t('charts.errorReadingExcel');
        this.parsedData = null;
      };
      
      reader.readAsArrayBuffer(file);
    },

    parseCSVData(data) {
      // 验证数据结构
      if (!data || data.length === 0) {
        throw new Error(this.$t('charts.csvEmpty'));
      }

      // 智能检测列名
      const firstRow = data[0];
      const columnNames = Object.keys(firstRow).filter(name => name && name.trim() !== '');
      
      if (columnNames.length < 2) {
        throw new Error(this.$t('charts.csvMinColumns'));
      }

      // 查找日期列和数值列
      let dateColumn = null;
      let valueColumn = null;

      // 优先检测 daily_returns.csv 格式的字段
      const hasDailyReturnFields = columnNames.some(name => 
        name === 'date' || name === 'daily_return' || name === 'cumulative_return'
      );

      if (hasDailyReturnFields) {
        // 支持 daily_returns.csv 格式
        // 优先使用 'date' 列，如果没有则使用 'candle_begin_time'
        if (columnNames.includes('date')) {
          dateColumn = 'date';
        } else if (columnNames.includes('candle_begin_time')) {
          dateColumn = 'candle_begin_time';
        }

        // 优先使用 'cumulative_return'，如果没有则使用 'daily_return'
        if (columnNames.includes('cumulative_return')) {
          valueColumn = 'cumulative_return';
        } else if (columnNames.includes('daily_return')) {
          valueColumn = 'daily_return';
        }
      } else {
        // 原有的智能检测逻辑
        // 优先检查第一列是否为日期（支持标准格式和斜杠格式）
        const firstColumnName = columnNames[0];
        const firstColumnValue = firstRow[firstColumnName];
        if (this.isDateColumn(firstColumnValue) || this.isDateColumnSlashFormat(firstColumnValue)) {
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
      }

      // 验证找到的列
      if (!dateColumn || !valueColumn) {
        throw new Error(this.$t('charts.cannotIdentifyColumns'));
      }

      // 解析数据
      const parsedData = data.map((row, index) => {
        const dateStr = row[dateColumn];
        const valueStr = row[valueColumn];

        // 验证并转换日期格式
        // 使用增强的日期标准化方法
        let normalizedDate = this.normalizeDate(dateStr);
        if (!normalizedDate) {
          throw new Error(this.$t('charts.invalidDateFormat', { row: index + 2, date: dateStr }));
        }

        // 验证数值
        const value = parseFloat(valueStr);
        if (isNaN(value)) {
          throw new Error(this.$t('charts.invalidValue', { row: index + 2, value: valueStr }));
        }

        return {
          date: normalizedDate,
          value: value
        };
      });

      this.parsedData = parsedData;
      this.chartData = parsedData;
      
      // 保存原始数据（用于指标计算）
      this.rawData = data;
      
      // 计算指标
      this.calculateMetrics(data, dateColumn);
      
      // 解析成功后获取API数据
      this.fetchMarketDataAndUpdateCharts(parsedData);
    },

    async fetchMarketDataAndUpdateCharts(csvData) {
      try {
        // 并行获取股票数据（Polygon）和加密货币数据（CoinGecko）
        const [stockResult, cryptoResult] = await Promise.allSettled([
          polygonApi.fetchAllMarketData(),
          fetchAllCryptoData(30)
        ]);

        // 合并数据：股票数据来自 Polygon，加密货币数据来自 CoinGecko
        const mergedMarketData = {};
        const allErrors = {};

        // 处理股票数据（S&P 500, NASDAQ）
        if (stockResult.status === 'fulfilled') {
          const stockData = stockResult.value;
          if (stockData.marketData) {
            Object.assign(mergedMarketData, stockData.marketData);
          }
          if (stockData.errors) {
            Object.assign(allErrors, stockData.errors);
          }
        } else {
          console.error('Failed to fetch stock data:', stockResult.reason);
          allErrors.stocks = stockResult.reason?.message || 'Failed to fetch stock data';
        }

        // 处理加密货币数据（BTC, ETH）
        if (cryptoResult.status === 'fulfilled') {
          const cryptoData = cryptoResult.value;
          if (cryptoData.marketData) {
            Object.assign(mergedMarketData, cryptoData.marketData);
          }
          if (cryptoData.errors) {
            Object.assign(allErrors, cryptoData.errors);
          }
        } else {
          console.error('Failed to fetch crypto data:', cryptoResult.reason);
          allErrors.crypto = cryptoResult.reason?.message || 'Failed to fetch crypto data';
        }

        // 设置合并后的市场数据
        this.marketData = mergedMarketData;
        this.apiError = Object.keys(allErrors).length > 0 
          ? 'Some market data failed to load' 
          : null;

        if (Object.keys(allErrors).length > 0) {
          console.warn('Some data failed to load:', allErrors);
        }

        // 计算市场数据的指标
        this.calculateMarketMetrics();

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
      if (!value || typeof value !== 'string') return false;
      // 支持 YYYY-MM-DD 格式（标准格式）
      const dashRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
      return dashRegex.test(value.trim());
    },

    isDateColumnSlashFormat(value) {
      if (!value || typeof value !== 'string') return false;
      // 支持 YYYY/M/D 或 YYYY/MM/DD 格式
      const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
      return dateRegex.test(value.trim());
    },

    // 增强的日期格式检测和转换
    normalizeDate(dateStr) {
      if (!dateStr || typeof dateStr !== 'string') {
        return null;
      }
      
      const trimmed = dateStr.trim();
      
      // 1. 尝试 YYYY/M/D 或 YYYY/MM/DD 格式
      if (this.isDateColumnSlashFormat(trimmed)) {
        return this.convertDateToStandardFormat(trimmed);
      }
      
      // 2. 尝试 YYYY-MM-DD 格式
      if (this.isDateColumn(trimmed)) {
        // 确保月份和日期是两位数
        const parts = trimmed.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return trimmed;
      }
      
      // 3. 尝试其他常见格式：MM/DD/YYYY, DD/MM/YYYY, YYYY.MM.DD 等
      // MM/DD/YYYY 或 M/D/YYYY
      const usDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const usMatch = trimmed.match(usDateRegex);
      if (usMatch) {
        const [, month, day, year] = usMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // DD/MM/YYYY 或 D/M/YYYY
      const euDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      // 注意：这个和上面的正则一样，但我们可以通过尝试解析来判断
      // 如果月份 > 12，可能是 DD/MM/YYYY 格式
      const euMatch = trimmed.match(euDateRegex);
      if (euMatch) {
        const [, part1, part2, year] = euMatch;
        const num1 = parseInt(part1);
        const num2 = parseInt(part2);
        if (num1 > 12 && num2 <= 12) {
          // 可能是 DD/MM/YYYY
          return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
        } else if (num1 <= 12 && num2 <= 12) {
          // 可能是 MM/DD/YYYY（默认）
          return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
        }
      }
      
      // YYYY.MM.DD 或 YYYY.M.D
      const dotDateRegex = /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/;
      const dotMatch = trimmed.match(dotDateRegex);
      if (dotMatch) {
        const [, year, month, day] = dotMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // 4. 尝试使用 JavaScript Date 对象解析
      const dateObj = new Date(trimmed);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      return null;
    },

    convertDateToStandardFormat(dateStr) {
      // 将 YYYY/M/D 格式转换为 YYYY-MM-DD 格式
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        return dateStr;
      }
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
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
      if (!this.marketData) {
        console.warn('No market data available');
        return;
      }

      console.log('Rendering market charts with data:', Object.keys(this.marketData));

      Object.keys(this.marketData).forEach(key => {
        // 使用 setTimeout 确保 DOM 已更新
        setTimeout(() => {
          const data = this.marketData[key];
          console.log(`Rendering chart for ${key}:`, data);
          this.renderMarketChart(key, data);
        }, 100);
      });
    },

    // 渲染单个市场数据图表
    renderMarketChart(key, data) {
      const chartRef = this.$refs[`chart-${key}`];
      if (!chartRef || !chartRef[0]) {
        console.warn(`Chart ref not found for ${key}`);
        return;
      }

      // 销毁已存在的图表实例
      const existingChart = echarts.getInstanceByDom(chartRef[0]);
      if (existingChart) {
        existingChart.dispose();
      }

      const chart = echarts.init(chartRef[0]);
      
      if (!data || !data.results || data.results.length === 0) {
        console.warn(`No data for ${key}:`, data);
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

      // 验证数据格式
      const validResults = data.results.filter(item => 
        item && 
        typeof item.t === 'number' && 
        (typeof item.o === 'number' || item.o === null) &&
        (typeof item.h === 'number' || item.h === null) &&
        (typeof item.l === 'number' || item.l === null) &&
        (typeof item.c === 'number' || item.c === null)
      );

      if (validResults.length === 0) {
        console.error(`No valid data for ${key}:`, data.results);
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
      const dates = validResults.map(item => {
        try {
          return new Date(item.t).toLocaleDateString();
        } catch (e) {
          return '';
        }
      }).filter(d => d);
      
      const chartConfig = this.createMarketChartSeries(validResults);
      const series = chartConfig.series;
      const yAxisConfig = chartConfig.yAxisConfig;

      // 验证配置
      if (!series || series.length === 0) {
        console.error(`No series created for ${key}`);
        return;
      }

      if (!yAxisConfig || !yAxisConfig.price) {
        console.error(`Invalid yAxisConfig for ${key}:`, yAxisConfig);
        return;
      }

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
              // 跳过 null 或 undefined 的值
              if (param.value === null || param.value === undefined || isNaN(param.value)) {
                return;
              }
              
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
          left: '10%',
          right: '10%',
          bottom: '10%',
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
        yAxis: (() => {
          const axes = [
            {
              type: 'value',
              name: this.$t('home.price'),
              position: 'left',
              min: yAxisConfig.price.min,
              max: yAxisConfig.price.max,
              axisLabel: { 
                color: '#ccc',
                formatter: function(value) {
                  if (value === null || value === undefined || isNaN(value)) {
                    return '';
                  }
                  return '$' + value.toFixed(2);
                }
              },
              axisLine: { lineStyle: { color: '#666' } },
              splitLine: { 
                lineStyle: { color: '#333' },
                show: true
              }
            }
          ];
          
          // 只在有成交量数据时添加成交量 Y 轴（CoinGecko 数据不包含成交量）
          if (yAxisConfig.hasVolume) {
            axes.push({
              type: 'value',
              name: this.$t('home.volume'),
              position: 'right',
              min: yAxisConfig.volume.min,
              max: yAxisConfig.volume.max,
              axisLabel: { 
                color: '#ccc',
                formatter: function(value) {
                  if (value === null || value === undefined || isNaN(value)) {
                    return '';
                  }
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
            });
          }
          
          return axes;
        })(),
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
      const volumeData = results.map(item => item.v).filter(v => v !== null && v !== undefined && !isNaN(v) && v > 0);
      // 过滤掉 vw（VWAP），因为 CoinGecko 数据中没有这个字段
      const priceData = results.map(item => [item.o, item.h, item.l, item.c]).flat().filter(v => v !== null && v !== undefined && !isNaN(v));
      
      // 检查是否有有效的成交量数据
      // 至少需要 50% 的数据点有成交量才显示成交量图表
      const hasVolume = volumeData.length > 0 && (volumeData.length / results.length) >= 0.5;
      
      const priceMin = priceData.length > 0 ? Math.min(...priceData) : 0;
      const priceMax = priceData.length > 0 ? Math.max(...priceData) : 0;
      
      // 为价格数据添加一些边距，让图表更美观
      const priceRange = priceMax - priceMin;
      // 如果价格范围太小或为0，使用价格本身的百分比作为边距
      const pricePadding = priceRange > 0 ? priceRange * 0.05 : Math.abs(priceMin || priceMax || 1) * 0.05;
      const adjustedPriceMin = Math.max(0, priceMin - pricePadding);
      const adjustedPriceMax = priceMax + pricePadding;
      
      // 为成交量数据添加边距（如果有成交量数据）
      let adjustedVolumeMin = 0;
      let adjustedVolumeMax = 0;
      if (hasVolume) {
        const volumeMin = Math.min(...volumeData);
        const volumeMax = Math.max(...volumeData);
        const volumeRange = volumeMax - volumeMin;
        const volumePadding = volumeRange * 0.1; // 10%的边距
        adjustedVolumeMin = Math.max(0, volumeMin - volumePadding);
        adjustedVolumeMax = volumeMax + volumePadding;
      }

      const series = [];
      
      // 只在有成交量数据时添加成交量系列
      if (hasVolume) {
        console.log(`Adding volume series for chart. Volume data points: ${volumeData.length}/${results.length}`);
        series.push({
          name: this.$t('home.volume'), 
          data: results.map(item => item.v || 0), 
          type: 'bar', 
          yAxisIndex: 1, 
          itemStyle: { 
            color: (params) => {
              // 根据涨跌显示不同颜色（如果有关闭价数据）
              const currentItem = results[params.dataIndex];
              const prevItem = params.dataIndex > 0 ? results[params.dataIndex - 1] : null;
              if (prevItem && currentItem && currentItem.c && prevItem.c) {
                return currentItem.c >= prevItem.c ? '#4caf50' : '#ef5350';
              }
              return '#ff6b6b';
            }
          },
          barWidth: '60%',
          barGap: '20%'
        });
      } else {
        console.log(`No volume data available. Volume data points: ${volumeData.length}/${results.length}`);
      }
      
      series.push(
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
        // VWAP 只在有数据时显示（CoinGecko 数据不包含 VWAP）
        ...(results.some(item => item.vw !== null && item.vw !== undefined && !isNaN(item.vw)) ? [{
          name: this.$t('home.vwap'), 
          data: results.map(item => item.vw || null), 
          type: 'line', 
          yAxisIndex: 0, 
          itemStyle: { color: '#ab47bc' },
          lineStyle: { width: 2, type: 'dashed' },
          symbol: 'diamond',
          symbolSize: 4
        }] : [])
      );

      // 确保价格范围有效
      const finalPriceMin = isNaN(adjustedPriceMin) || adjustedPriceMin === Infinity ? 0 : adjustedPriceMin;
      const finalPriceMax = isNaN(adjustedPriceMax) || adjustedPriceMax === Infinity || adjustedPriceMax === 0 
        ? (priceMax || 100) 
        : adjustedPriceMax;

      return {
        series,
        yAxisConfig: {
          price: { 
            min: finalPriceMin, 
            max: finalPriceMax 
          },
          volume: { 
            min: adjustedVolumeMin, 
            max: adjustedVolumeMax 
          },
          hasVolume: hasVolume // 标记是否有成交量数据
        }
      };
    },

    // 获取数据标题
    getDataTitle(key) {
      // 如果是加密货币，使用 CoinGecko 的标题
      if (key === 'btc' || key === 'eth') {
        return getCryptoDataTitle(key);
      }
      // 否则使用 Polygon 的标题
      return polygonApi.getDataTitle(key);
    },

    // 计算所有指标
    calculateMetrics(rawData, dateColumn) {
      if (!rawData || rawData.length === 0) {
        this.metrics = null;
        return;
      }

      // 检查是否有 daily_return 字段
      const firstRow = rawData[0];
      const hasDailyReturn = 'daily_return' in firstRow && 
                            firstRow.daily_return !== '' && 
                            firstRow.daily_return !== null &&
                            firstRow.daily_return !== undefined;
      
      let dailyReturns = [];
      
      if (hasDailyReturn) {
        // 提取 daily_return 数组和日期数组，确保它们一一对应
        const tempData = [];
        for (let i = 0; i < rawData.length; i++) {
          const row = rawData[i];
          const dr = parseFloat(row.daily_return);
          if (!isNaN(dr)) {
            const dateStr = row[dateColumn];
            if (dateStr) {
              const normalized = this.normalizeDate(dateStr);
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
        this.dates = tempData.map(item => item.date);
        dailyReturns = tempData.map(item => item.dailyReturn);
        } else {
        // 如果没有 daily_return，尝试从 parsedData 的 value 字段计算
        // 或者从原始数据的 cumulative_return 反推
        if (this.parsedData && this.parsedData.length > 1) {
          const result = this.calculateMetricsFromValue(this.parsedData, 'date');
          if (result) {
            this.metrics = result;
            // 从 parsedData 反推 dailyReturns 和 dates
            const values = this.parsedData.map(item => item.value);
            this.dailyReturns = [];
            this.dates = [];
            for (let i = 1; i < values.length; i++) {
              if (values[i - 1] > 0) {
                const dailyReturn = (values[i] - values[i - 1]) / values[i - 1];
                this.dailyReturns.push(dailyReturn);
                this.dates.push(this.parsedData[i].date);
              }
            }
            // 渲染分析图表
            this.$nextTick(() => {
              this.renderAnalysisCharts();
            });
          }
          return;
        } else if ('cumulative_return' in firstRow) {
          // 从 cumulative_return 反推 daily_return
          // cumulative_return[i] = (1 + r1) * (1 + r2) * ... * (1 + ri) - 1
          // 所以 daily_return[i] = (cumulative_return[i] + 1) / (cumulative_return[i-1] + 1) - 1
          const cumulativeReturns = rawData
            .map(row => {
              const cr = parseFloat(row.cumulative_return);
              return isNaN(cr) ? null : cr;
            })
            .filter(cr => cr !== null);
          
          if (cumulativeReturns.length > 1) {
            dailyReturns = [];
            const rawDates = rawData
              .map(row => {
                const dateStr = row[dateColumn];
                if (!dateStr) return null;
                return this.normalizeDate(dateStr);
              })
              .filter(date => date !== null);
            
            // 保存原始日期数组（用于 startDate/endDate）
            const originalDates = [...rawDates];
            this.dates = [];
            
            for (let i = 1; i < cumulativeReturns.length; i++) {
              const prevCumulative = cumulativeReturns[i - 1];
              const currCumulative = cumulativeReturns[i];
              if (prevCumulative !== null && currCumulative !== null) {
                const prevValue = 1 + prevCumulative;
                const currValue = 1 + currCumulative;
                if (prevValue > 0) {
                  const dailyReturn = (currValue / prevValue) - 1;
                  dailyReturns.push(dailyReturn);
                  // dates 对应 dailyReturns，所以使用第 i 个日期（因为 dailyReturn 是从 i-1 到 i 的变化）
                  if (i < rawDates.length) {
                    this.dates.push(rawDates[i]);
                  }
                }
              }
            }
            
            // 确保 dates 和 dailyReturns 长度一致
            const minLen = Math.min(this.dates.length, dailyReturns.length);
            this.dates = this.dates.slice(0, minLen);
            dailyReturns = dailyReturns.slice(0, minLen);
            
            // 保存原始日期数组，用于后续的 startDate/endDate 计算
            this.originalDates = originalDates;
          }
        }
      }

      if (dailyReturns.length === 0) {
        this.metrics = null;
        return;
      }

      // 提取日期（如果还没有保存）
      if (!this.dates || this.dates.length === 0) {
        this.dates = rawData
          .map(row => {
            const dateStr = row[dateColumn];
            if (!dateStr) return null;
            return this.normalizeDate(dateStr);
          })
          .filter(date => date !== null);
        // 保存原始日期数组（用于 startDate/endDate）
        if (!this.originalDates || this.originalDates.length === 0) {
          this.originalDates = [...this.dates];
        }
      } else if (!this.originalDates || this.originalDates.length === 0) {
        // 如果 dates 已存在但 originalDates 不存在，使用 dates 作为 originalDates
        this.originalDates = [...this.dates];
      }

      // 确保 dates 和 dailyReturns 长度一致
      const minLength = Math.min(this.dates.length, dailyReturns.length);
      this.dates = this.dates.slice(0, minLength);
      dailyReturns = dailyReturns.slice(0, minLength);

      if (this.dates.length === 0 || dailyReturns.length === 0) {
        this.metrics = null;
        return;
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
      
      if (this.originalDates && this.originalDates.length > 0) {
        // 使用原始日期数组的第一个和最后一个日期
        firstDate = parseDate(this.originalDates[0]);
        lastDate = parseDate(this.originalDates[this.originalDates.length - 1]);
      }
      
      // 如果没有原始日期数组或解析失败，使用当前 dates 数组
      if (!firstDate || !lastDate) {
        if (this.dates && this.dates.length > 0) {
          firstDate = parseDate(this.dates[0]);
          lastDate = parseDate(this.dates[this.dates.length - 1]);
        }
      }
      
      // 如果还是失败，尝试从 rawData 获取原始日期
      if (!firstDate || !lastDate) {
        console.warn('Failed to parse dates from this.dates, trying rawData:', { 
          firstDateStr: this.dates && this.dates[0], 
          lastDateStr: this.dates && this.dates[this.dates.length - 1],
          datesLength: this.dates ? this.dates.length : 0,
          originalDatesLength: this.originalDates ? this.originalDates.length : 0
        });
        const rawDates = rawData
          .map(row => {
            const dateStr = row[dateColumn];
            if (!dateStr) return null;
            return this.normalizeDate(dateStr);
          })
          .filter(date => date !== null);
        
        if (rawDates.length > 0) {
          const fallbackFirst = parseDate(rawDates[0]);
          const fallbackLast = parseDate(rawDates[rawDates.length - 1]);
          if (fallbackFirst && fallbackLast) {
            firstDate = fallbackFirst;
            lastDate = fallbackLast;
            console.log('Successfully parsed dates from rawData:', { firstDate, lastDate });
          } else {
            console.error('Failed to parse dates from rawData:', { rawDates: rawDates.slice(0, 3) });
          }
        } else {
          console.error('No rawDates available');
        }
      }
      
      if (!firstDate || !lastDate) {
        console.error('Failed to parse dates after all attempts:', { 
          rawDataSample: rawData.slice(0, 3), 
          dateColumn,
          datesSample: this.dates ? this.dates.slice(0, 3) : [],
          originalDatesSample: this.originalDates ? this.originalDates.slice(0, 3) : []
        });
        this.metrics = null;
        return;
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
        cumulativeReturn: this.calculateCumulativeReturn(dailyReturns),
        
        // 2. 年化收益率 (CAGR)
        cagr: this.calculateCAGR(dailyReturns, years),
        
        // 3. 年化波动率
        volatility: this.calculateVolatility(dailyReturns),
        
        // 4. 夏普比率
        sharpeRatio: this.calculateSharpeRatio(dailyReturns),
        
        // 5. Sortino Ratio
        sortinoRatio: this.calculateSortinoRatio(dailyReturns),
        
        // 6. 最大回撤
        maxDrawdown: this.calculateMaxDrawdown(dailyReturns),
        
        // 7. Duration of MD (最大回撤的持续时间)
        durationOfMD: this.calculateDurationOfMD(dailyReturns, this.dates),
        
        // 8. 最大回撤持续时间 (MDD)
        maxDrawdownDuration: this.calculateMaxDrawdownDuration(dailyReturns, this.dates),
        
        // 9. Drawdown of MDD (最长持续时间回撤的幅度)
        drawdownOfMDD: this.calculateDrawdownOfMDD(dailyReturns, this.dates),
        
        // 10. Calmar Ratio
        calmarRatio: this.calculateCalmarRatio(dailyReturns, years),
        
        // 11. VaR (95%)
        var95: this.calculateVaR(dailyReturns, 0.95),
        
        // 12. 1-month VaR (99%)
        var99Monthly: this.calculateMonthlyVaR(dailyReturns, this.dates, 0.99),
        
        // 13. CVaR (95%)
        cvar95: this.calculateCVaR(dailyReturns, 0.95),
        
        // 14. CVaR (99%)
        cvar99: this.calculateCVaR(dailyReturns, 0.99),
        
        // 15. Gini Coefficient
        giniCoefficient: this.calculateGiniCoefficient(dailyReturns),
        
        // 16. Omega Ratio
        omegaRatio: this.calculateOmegaRatio(dailyReturns),
        
        // 17. Gain/Pain Ratio (1M)
        gainPainRatio: this.calculateGainPainRatio(dailyReturns, this.dates),
        
        // 18. Tail Ratio
        tailRatio: this.calculateTailRatio(dailyReturns),
        
        // 19. Outlier Win Ratio
        outlierWinRatio: this.calculateOutlierWinRatio(dailyReturns),
        
        // 20. Outlier Loss Ratio
        outlierLossRatio: this.calculateOutlierLossRatio(dailyReturns),
        
        // 13. 最佳/最差单日收益
        bestDay: this.calculateBestDay(dailyReturns),
        worstDay: this.calculateWorstDay(dailyReturns),
        
        // 21. Rolling Sharpe 90d Mean/Median/Last
        rollingSharpe90dMean: this.calculateRollingSharpeStats(dailyReturns, 90).mean,
        rollingSharpe90dMedian: this.calculateRollingSharpeStats(dailyReturns, 90).median,
        rollingSharpe90dLast: this.calculateRollingSharpeStats(dailyReturns, 90).last,
        
        // 22. Rolling Sharpe 365d Mean/Median/Last
        rollingSharpe365dMean: this.calculateRollingSharpeStats(dailyReturns, 365).mean,
        rollingSharpe365dMedian: this.calculateRollingSharpeStats(dailyReturns, 365).median,
        rollingSharpe365dLast: this.calculateRollingSharpeStats(dailyReturns, 365).last,
        
        // 23. MTD / 3M / 6M / YTD
        mtd: this.calculateMTD(dailyReturns, this.dates),
        return3M: this.calculatePeriodReturn(dailyReturns, this.dates, 90),
        return6M: this.calculatePeriodReturn(dailyReturns, this.dates, 180),
        ytd: this.calculateYTD(dailyReturns, this.dates),
        
        // 24. 最佳/最差单日收益
        bestDay: this.calculateBestDay(dailyReturns),
        worstDay: this.calculateWorstDay(dailyReturns),
        
        // 25. 最佳/最差单月收益
        bestMonth: this.calculateBestMonth(dailyReturns, this.dates),
        worstMonth: this.calculateWorstMonth(dailyReturns, this.dates),
        
        // 26. 最佳/最差年度收益
        bestYear: this.calculateBestYear(dailyReturns, this.dates),
        worstYear: this.calculateWorstYear(dailyReturns, this.dates),
        
        // 27. 偏度
        skew: this.calculateSkew(dailyReturns),
        
        // 28. 峰度
        kurtosis: this.calculateKurtosis(dailyReturns),
        
        // 额外信息
        totalDays: totalDays,
        years: years,
        dataPoints: dailyReturns.length
      };

      this.metrics = metrics;
      
      // 保存日收益率和日期数组，用于图表绘制
      this.dailyReturns = dailyReturns;
      // dates 已经在前面保存了
      
      // 渲染分析图表
      this.$nextTick(() => {
        this.renderAnalysisCharts();
      });
    },

    // 从 value 字段计算指标（如果没有 daily_return）
    calculateMetricsFromValue(parsedData, dateColumn) {
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
        cagr: this.calculateCAGR(dailyReturns, years),
        volatility: this.calculateVolatility(dailyReturns),
        sharpeRatio: this.calculateSharpeRatio(dailyReturns),
        sortinoRatio: this.calculateSortinoRatio(dailyReturns),
        maxDrawdown: this.calculateMaxDrawdown(dailyReturns),
        calmarRatio: this.calculateCalmarRatio(dailyReturns, years),
        var95: this.calculateVaR(dailyReturns, 0.95),
        cvar95: this.calculateCVaR(dailyReturns, 0.95),
        omegaRatio: this.calculateOmegaRatio(dailyReturns),
        tailRatio: this.calculateTailRatio(dailyReturns),
        maxDrawdownDuration: this.calculateMaxDrawdownDuration(dailyReturns, alignedDates),
        durationOfMD: this.calculateDurationOfMD(dailyReturns, alignedDates),
        drawdownOfMDD: this.calculateDrawdownOfMDD(dailyReturns, alignedDates),
        var99Monthly: this.calculateMonthlyVaR(dailyReturns, alignedDates, 0.99),
        cvar99: this.calculateCVaR(dailyReturns, 0.99),
        giniCoefficient: this.calculateGiniCoefficient(dailyReturns),
        gainPainRatio: this.calculateGainPainRatio(dailyReturns, alignedDates),
        outlierWinRatio: this.calculateOutlierWinRatio(dailyReturns),
        outlierLossRatio: this.calculateOutlierLossRatio(dailyReturns),
        rollingSharpe90dMean: this.calculateRollingSharpeStats(dailyReturns, 90).mean,
        rollingSharpe90dMedian: this.calculateRollingSharpeStats(dailyReturns, 90).median,
        rollingSharpe90dLast: this.calculateRollingSharpeStats(dailyReturns, 90).last,
        rollingSharpe365dMean: this.calculateRollingSharpeStats(dailyReturns, 365).mean,
        rollingSharpe365dMedian: this.calculateRollingSharpeStats(dailyReturns, 365).median,
        rollingSharpe365dLast: this.calculateRollingSharpeStats(dailyReturns, 365).last,
        mtd: this.calculateMTD(dailyReturns, alignedDates),
        return3M: this.calculatePeriodReturn(dailyReturns, alignedDates, 90),
        return6M: this.calculatePeriodReturn(dailyReturns, alignedDates, 180),
        ytd: this.calculateYTD(dailyReturns, alignedDates),
        bestDay: this.calculateBestDay(dailyReturns),
        worstDay: this.calculateWorstDay(dailyReturns),
        bestMonth: this.calculateBestMonth(dailyReturns, alignedDates),
        worstMonth: this.calculateWorstMonth(dailyReturns, alignedDates),
        bestYear: this.calculateBestYear(dailyReturns, alignedDates),
        worstYear: this.calculateWorstYear(dailyReturns, alignedDates),
        skew: this.calculateSkew(dailyReturns),
        kurtosis: this.calculateKurtosis(dailyReturns),
        totalDays: totalDays,
        years: years,
        dataPoints: dailyReturns.length
      };
    },

    // 1. 累计收益
    calculateCumulativeReturn(dailyReturns) {
      let cumulative = 1;
      for (const dr of dailyReturns) {
        cumulative *= (1 + dr);
      }
      return cumulative - 1;
    },

    // 2. 年化收益率 (CAGR)
    calculateCAGR(dailyReturns, years) {
      if (years <= 0) return 0;
      const cumulativeReturn = this.calculateCumulativeReturn(dailyReturns);
      const totalReturn = cumulativeReturn + 1;
      return Math.pow(totalReturn, 1 / years) - 1;
    },

    // 3. 年化波动率
    calculateVolatility(dailyReturns) {
      if (dailyReturns.length < 2) return 0;
      const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
      const stdDev = Math.sqrt(variance);
      return stdDev * Math.sqrt(252); // 年化
    },

    // 4. 夏普比率
    calculateSharpeRatio(dailyReturns) {
      if (dailyReturns.length < 2) return 0;
      const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const volatility = this.calculateVolatility(dailyReturns);
      if (volatility === 0) return 0;
      // Sharpe = (平均日收益 * 252) / 年化波动率
      // 或者 = 平均日收益 / 日波动率 * √252
      const annualizedReturn = mean * 252;
      return annualizedReturn / volatility;
    },

    // 5. Sortino Ratio
    calculateSortinoRatio(dailyReturns) {
      if (dailyReturns.length < 2) return 0;
      const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const negativeReturns = dailyReturns.filter(dr => dr < 0);
      if (negativeReturns.length === 0) return Infinity;
      // 计算下行波动率（只考虑负收益）
      const downsideVariance = negativeReturns.reduce((sum, dr) => sum + Math.pow(dr, 2), 0) / dailyReturns.length;
      const downsideStdDev = Math.sqrt(downsideVariance);
      if (downsideStdDev === 0) return 0;
      // Sortino = (平均日收益 * 252) / 年化下行波动率
      const annualizedReturn = mean * 252;
      const annualizedDownsideVol = downsideStdDev * Math.sqrt(252);
      return annualizedReturn / annualizedDownsideVol;
    },

    // 6. 最大回撤
    calculateMaxDrawdown(dailyReturns) {
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
    },

    // 7. Calmar Ratio
    calculateCalmarRatio(dailyReturns, years) {
      const cagr = this.calculateCAGR(dailyReturns, years);
      const maxDrawdown = this.calculateMaxDrawdown(dailyReturns);
      if (maxDrawdown === 0) return 0;
      return cagr / Math.abs(maxDrawdown);
    },

    // 8. VaR (Value at Risk)
    calculateVaR(dailyReturns, confidence) {
      if (dailyReturns.length === 0) return 0;
      const sorted = [...dailyReturns].sort((a, b) => a - b);
      const index = Math.floor((1 - confidence) * sorted.length);
      return sorted[Math.max(0, index)];
    },

    // 9. CVaR (Conditional VaR)
    calculateCVaR(dailyReturns, confidence) {
      const varValue = this.calculateVaR(dailyReturns, confidence);
      const tailReturns = dailyReturns.filter(dr => dr <= varValue);
      if (tailReturns.length === 0) return varValue;
      return tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length;
    },

    // 10. Omega Ratio
    calculateOmegaRatio(dailyReturns, threshold = 0) {
      const positiveReturns = dailyReturns.filter(dr => dr > threshold);
      const negativeReturns = dailyReturns.filter(dr => dr < threshold);
      
      if (negativeReturns.length === 0) return Infinity;
      
      const positiveSum = positiveReturns.reduce((sum, dr) => sum + (dr - threshold), 0);
      const negativeSum = negativeReturns.reduce((sum, dr) => sum + Math.abs(dr - threshold), 0);
      
      if (negativeSum === 0) return Infinity;
      return positiveSum / negativeSum;
    },

    // 11. Tail Ratio
    calculateTailRatio(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      const sorted = [...dailyReturns].sort((a, b) => a - b);
      const p95 = sorted[Math.floor(0.95 * sorted.length)];
      const p5 = sorted[Math.floor(0.05 * sorted.length)];
      if (p5 === 0) return Infinity;
      return Math.abs(p95 / p5);
    },

    // 12. 最大回撤持续时间
    calculateMaxDrawdownDuration(dailyReturns, dates) {
      if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
      
      let cumulative = 1;
      let maxCumulative = 1;
      let maxCumulativeIndex = 0;
      let drawdownStartIndex = -1;
      let maxDrawdownDuration = 0;
      
      for (let i = 0; i < dailyReturns.length; i++) {
        cumulative *= (1 + dailyReturns[i]);
        
        if (cumulative > maxCumulative) {
          // 创新高，结束当前回撤
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
          // 开始新的回撤
          drawdownStartIndex = maxCumulativeIndex;
        }
      }
      
      // 处理最后一个回撤（如果还在回撤中）
      if (drawdownStartIndex >= 0) {
        const duration = dailyReturns.length - 1 - drawdownStartIndex;
        if (duration > maxDrawdownDuration) {
          maxDrawdownDuration = duration;
        }
      }
      
      return maxDrawdownDuration;
    },

    // 13. 最佳单日收益
    calculateBestDay(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      return Math.max(...dailyReturns);
    },

    // 14. 最差单日收益
    calculateWorstDay(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      return Math.min(...dailyReturns);
    },

    // 15. 最佳单月收益
    calculateBestMonth(dailyReturns, dates) {
      if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
      
      const monthlyReturns = this.calculateMonthlyReturns(dailyReturns, dates);
      if (monthlyReturns.length === 0) return 0;
      return Math.max(...monthlyReturns);
    },

    // 16. 最差单月收益
    calculateWorstMonth(dailyReturns, dates) {
      if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
      
      const monthlyReturns = this.calculateMonthlyReturns(dailyReturns, dates);
      if (monthlyReturns.length === 0) return 0;
      return Math.min(...monthlyReturns);
    },

    // 辅助方法：计算每月收益
    calculateMonthlyReturns(dailyReturns, dates) {
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
      
      // 计算每月收益
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
    },

    // 17. 偏度
    calculateSkew(dailyReturns) {
      if (dailyReturns.length < 3) return 0;
      
      const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) return 0;
      
      // 三阶矩（偏度）
      const n = dailyReturns.length;
      const skewness = dailyReturns.reduce((sum, dr) => {
        return sum + Math.pow((dr - mean) / stdDev, 3);
      }, 0) / n;
      
      return skewness;
    },

    // 18. 峰度
    calculateKurtosis(dailyReturns) {
      if (dailyReturns.length < 4) return 0;
      
      const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
      const variance = dailyReturns.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / dailyReturns.length;
      const stdDev = Math.sqrt(variance);
      
      if (stdDev === 0) return 0;
      
      // 四阶矩（峰度），减去3得到超额峰度
      const n = dailyReturns.length;
      const kurtosis = dailyReturns.reduce((sum, dr) => {
        return sum + Math.pow((dr - mean) / stdDev, 4);
      }, 0) / n - 3; // 减去3得到超额峰度（正态分布的峰度为3）
      
      return kurtosis;
    },

    // 19. Duration of MD (最大回撤的持续时间)
    calculateDurationOfMD(dailyReturns, dates) {
      if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
      
      let cumulative = 1;
      let maxCumulative = 1;
      let maxCumulativeIndex = 0;
      let maxDrawdown = 0;
      let maxDrawdownStartIndex = -1;
      let maxDrawdownEndIndex = -1;
      
      // 找到最大回撤的起点和终点
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
      
      // 找到恢复点（净值重新超过起点）
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
        // 如果还没恢复，返回到当前的天数
        return dailyReturns.length - 1 - maxDrawdownStartIndex;
      }
      
      return 0;
    },

    // 20. Drawdown of MDD (最长持续时间回撤的幅度)
    calculateDrawdownOfMDD(dailyReturns, dates) {
      if (dailyReturns.length === 0 || !dates || dates.length === 0) return 0;
      
      let cumulative = 1;
      let maxCumulative = 1;
      let maxCumulativeIndex = 0;
      let drawdownStartIndex = -1;
      let maxDrawdownDuration = 0;
      let maxDrawdownDurationStartIndex = -1;
      let maxDrawdownDurationEndIndex = -1;
      
      // 找到最长持续时间的回撤
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
      
      // 处理最后一个回撤
      if (drawdownStartIndex >= 0) {
        const duration = dailyReturns.length - 1 - drawdownStartIndex;
        if (duration > maxDrawdownDuration) {
          maxDrawdownDuration = duration;
          maxDrawdownDurationStartIndex = drawdownStartIndex;
          maxDrawdownDurationEndIndex = dailyReturns.length - 1;
        }
      }
      
      // 计算最长持续时间回撤的幅度
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
    },

    // 21. 1-month VaR (99%)
    calculateMonthlyVaR(dailyReturns, dates, confidence) {
      const monthlyReturns = this.calculateMonthlyReturns(dailyReturns, dates);
      if (monthlyReturns.length === 0) return 0;
      const sorted = [...monthlyReturns].sort((a, b) => a - b);
      const index = Math.floor((1 - confidence) * sorted.length);
      return sorted[Math.max(0, index)];
    },

    // 22. Gini Coefficient
    calculateGiniCoefficient(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      
      // 使用收益绝对值
      const absReturns = dailyReturns.map(r => Math.abs(r));
      const sorted = [...absReturns].sort((a, b) => a - b);
      const n = sorted.length;
      const sum = sorted.reduce((a, b) => a + b, 0);
      
      if (sum === 0) return 0;
      
      // 计算洛伦兹曲线下面积
      let lorenzArea = 0;
      let cumulativeSum = 0;
      for (let i = 0; i < n; i++) {
        cumulativeSum += sorted[i];
        lorenzArea += (cumulativeSum / sum) / n;
      }
      
      // Gini = 1 - 2 * 洛伦兹曲线下面积
      return 1 - 2 * lorenzArea;
    },

    // 23. Gain/Pain Ratio (1M)
    calculateGainPainRatio(dailyReturns, dates) {
      const monthlyReturns = this.calculateMonthlyReturns(dailyReturns, dates);
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
    },

    // 24. Outlier Win Ratio
    calculateOutlierWinRatio(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      const sorted = [...dailyReturns].sort((a, b) => a - b);
      const p99 = sorted[Math.floor(0.99 * sorted.length)];
      const positiveOutliers = dailyReturns.filter(r => r > p99 && r > 0);
      return positiveOutliers.length / dailyReturns.length;
    },

    // 25. Outlier Loss Ratio
    calculateOutlierLossRatio(dailyReturns) {
      if (dailyReturns.length === 0) return 0;
      const sorted = [...dailyReturns].sort((a, b) => a - b);
      const p1 = sorted[Math.floor(0.01 * sorted.length)];
      const negativeOutliers = dailyReturns.filter(r => r < p1 && r < 0);
      return negativeOutliers.length / dailyReturns.length;
    },

    // 26. Rolling Sharpe Stats
    calculateRollingSharpeStats(dailyReturns, windowSize) {
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
    },

    // 27. MTD (Month to Date)
    calculateMTD(dailyReturns, dates) {
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
    },

    // 28. Period Return (3M, 6M)
    calculatePeriodReturn(dailyReturns, dates, days) {
      if (dailyReturns.length === 0) return 0;
      
      const startIndex = Math.max(0, dailyReturns.length - days);
      let cumulative = 1;
      for (let i = startIndex; i < dailyReturns.length; i++) {
        cumulative *= (1 + dailyReturns[i]);
      }
      
      return cumulative - 1;
    },

    // 29. YTD (Year to Date)
    calculateYTD(dailyReturns, dates) {
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
    },

    // 30. Best Year
    calculateBestYear(dailyReturns, dates) {
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
    },

    // 31. Worst Year
    calculateWorstYear(dailyReturns, dates) {
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
    },

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

    // 将市场数据（OHLC）转换为日收益率
    convertMarketDataToDailyReturns(marketData) {
      if (!marketData || !marketData.results || marketData.results.length < 2) {
        return { dailyReturns: [], dates: [] };
      }

      // 按时间排序
      const sortedResults = [...marketData.results]
        .filter(item => item && item.t && item.c !== null && item.c !== undefined && !isNaN(item.c))
        .sort((a, b) => a.t - b.t);

      if (sortedResults.length < 2) {
        return { dailyReturns: [], dates: [] };
      }

      const dailyReturns = [];
      const dates = [];

      for (let i = 1; i < sortedResults.length; i++) {
        const prevClose = sortedResults[i - 1].c;
        const currClose = sortedResults[i].c;

        if (prevClose > 0 && currClose > 0) {
          const dailyReturn = (currClose - prevClose) / prevClose;
          dailyReturns.push(dailyReturn);
          
          // 格式化日期
          try {
            const date = new Date(sortedResults[i].t);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            dates.push(`${year}-${month}-${day}`);
          } catch (e) {
            dates.push(new Date(sortedResults[i].t).toISOString().split('T')[0]);
          }
        }
      }

      return { dailyReturns, dates };
    },

    // 计算市场数据的指标
    calculateMarketMetrics() {
      if (!this.marketData) {
        console.warn('No market data available for metrics calculation');
        return;
      }

      const marketKeys = {
        sp500: 'sp500',
        nasdaq: 'nasdaq',
        btc: 'btc',
        eth: 'eth'
      };

      this.marketMetrics = {};

      Object.keys(marketKeys).forEach(key => {
        const data = this.marketData[key];
        
        // 调试：打印数据结构
        console.log(`Processing ${key}:`, {
          hasData: !!data,
          dataType: data ? typeof data : 'null',
          hasResults: data && !!data.results,
          resultsLength: data && data.results ? data.results.length : 0,
          dataKeys: data ? Object.keys(data) : []
        });
        
        if (!data) {
          console.warn(`No data for ${key}`);
          return;
        }
        
        // 处理不同的数据结构
        let results = null;
        if (data.results && Array.isArray(data.results)) {
          // Polygon API 格式：{ results: [...] }
          results = data.results;
        } else if (Array.isArray(data)) {
          // CoinGecko API 格式：直接是数组
          results = data;
        } else {
          console.warn(`Invalid data structure for ${key}:`, data);
          return;
        }
        
        if (!results || results.length < 2) {
          console.warn(`Insufficient data for ${key}: ${results ? results.length : 0} items`);
          return;
        }

        // 将数据转换为统一格式
        const normalizedData = { results: results };
        const { dailyReturns, dates } = this.convertMarketDataToDailyReturns(normalizedData);
        
        console.log(`Converted ${key} data:`, {
          dailyReturnsLength: dailyReturns.length,
          datesLength: dates.length,
          firstFewReturns: dailyReturns.slice(0, 3),
          firstFewDates: dates.slice(0, 3)
        });
        
        if (dailyReturns.length === 0 || dates.length === 0) {
          console.warn(`No valid daily returns or dates for ${key}`);
          return;
        }

        // 解析日期，支持字符串格式
        const parseDate = (dateStr) => {
          if (!dateStr) return null;
          if (dateStr instanceof Date) {
            return isNaN(dateStr.getTime()) ? null : dateStr;
          }
          const date = new Date(dateStr);
          return isNaN(date.getTime()) ? null : date;
        };

        const firstDate = parseDate(dates[0]);
        const lastDate = parseDate(dates[dates.length - 1]);
        
        if (!firstDate || !lastDate) {
          console.error(`Failed to parse dates for ${key}:`, { dates });
          return;
        }
        
        const totalDays = Math.max(1, Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
        const years = totalDays / 365.25;

        // 格式化日期（不允许返回 N/A）
        const formatDate = (date) => {
          if (!date || isNaN(date.getTime())) {
            console.error(`Invalid date for ${key}:`, date);
            throw new Error(`Failed to format date for ${key}`);
          }
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        this.marketMetrics[key] = {
          startDate: formatDate(firstDate),
          endDate: formatDate(lastDate),
          cumulativeReturn: this.calculateCumulativeReturn(dailyReturns),
          cagr: this.calculateCAGR(dailyReturns, years),
          volatility: this.calculateVolatility(dailyReturns),
          sharpeRatio: this.calculateSharpeRatio(dailyReturns),
          sortinoRatio: this.calculateSortinoRatio(dailyReturns),
          maxDrawdown: this.calculateMaxDrawdown(dailyReturns),
          durationOfMD: this.calculateDurationOfMD(dailyReturns, dates),
          maxDrawdownDuration: this.calculateMaxDrawdownDuration(dailyReturns, dates),
          drawdownOfMDD: this.calculateDrawdownOfMDD(dailyReturns, dates),
          calmarRatio: this.calculateCalmarRatio(dailyReturns, years),
          var95: this.calculateVaR(dailyReturns, 0.95),
          var99Monthly: this.calculateMonthlyVaR(dailyReturns, dates, 0.99),
          cvar95: this.calculateCVaR(dailyReturns, 0.95),
          cvar99: this.calculateCVaR(dailyReturns, 0.99),
          giniCoefficient: this.calculateGiniCoefficient(dailyReturns),
          omegaRatio: this.calculateOmegaRatio(dailyReturns),
          gainPainRatio: this.calculateGainPainRatio(dailyReturns, dates),
          tailRatio: this.calculateTailRatio(dailyReturns),
          outlierWinRatio: this.calculateOutlierWinRatio(dailyReturns),
          outlierLossRatio: this.calculateOutlierLossRatio(dailyReturns),
          rollingSharpe90dMean: this.calculateRollingSharpeStats(dailyReturns, 90).mean,
          rollingSharpe90dMedian: this.calculateRollingSharpeStats(dailyReturns, 90).median,
          rollingSharpe90dLast: this.calculateRollingSharpeStats(dailyReturns, 90).last,
          rollingSharpe365dMean: this.calculateRollingSharpeStats(dailyReturns, 365).mean,
          rollingSharpe365dMedian: this.calculateRollingSharpeStats(dailyReturns, 365).median,
          rollingSharpe365dLast: this.calculateRollingSharpeStats(dailyReturns, 365).last,
          mtd: this.calculateMTD(dailyReturns, dates),
          return3M: this.calculatePeriodReturn(dailyReturns, dates, 90),
          return6M: this.calculatePeriodReturn(dailyReturns, dates, 180),
          ytd: this.calculateYTD(dailyReturns, dates),
          bestDay: this.calculateBestDay(dailyReturns),
          worstDay: this.calculateWorstDay(dailyReturns),
          bestMonth: this.calculateBestMonth(dailyReturns, dates),
          worstMonth: this.calculateWorstMonth(dailyReturns, dates),
          bestYear: this.calculateBestYear(dailyReturns, dates),
          worstYear: this.calculateWorstYear(dailyReturns, dates),
          skew: this.calculateSkew(dailyReturns),
          kurtosis: this.calculateKurtosis(dailyReturns),
          totalDays: totalDays,
          years: years,
          dataPoints: dailyReturns.length
        };
        
        console.log(`Successfully calculated metrics for ${key}:`, {
          startDate: this.marketMetrics[key].startDate,
          endDate: this.marketMetrics[key].endDate,
          cumulativeReturn: this.marketMetrics[key].cumulativeReturn,
          dataPoints: this.marketMetrics[key].dataPoints
        });
      });
      
      console.log('Final marketMetrics:', Object.keys(this.marketMetrics));
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
    },

    // 渲染所有分析图表
    renderAnalysisCharts() {
      if (!this.dailyReturns || this.dailyReturns.length === 0) return;
      
      this.renderCumulativeReturnsChart();
      this.renderDrawdownChart();
      this.renderRollingSharpeChart();
      this.renderMonthlyReturnsChart();
      this.renderYearlyReturnsChart();
      this.renderReturnDistributionChart();
      this.renderRollingVolatilityChart();
    },

    // 1. 累计收益曲线
    renderCumulativeReturnsChart() {
      if (!this.$refs.cumulativeReturnsChart) return;
      
      const chart = echarts.init(this.$refs.cumulativeReturnsChart);
      
      // 计算累计净值
      const cumulativeValues = [];
      let cumulative = 1;
      for (const dr of this.dailyReturns) {
        cumulative *= (1 + dr);
        cumulativeValues.push(cumulative);
      }
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.cumulativeReturns'),
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('tooltips.date', { date: data.axisValue })}<br/>${this.$t('charts.analysisCharts.netValue')}: ${data.value.toFixed(4)}<br/>${this.$t('charts.analysisCharts.return')}: ${((data.value - 1) * 100).toFixed(2)}%`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: this.dates,
          axisLabel: { color: '#ccc', rotate: 45, fontSize: 10 },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            color: '#ccc',
            formatter: (value) => value.toFixed(2)
          },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.netValue'),
          type: 'line',
          data: cumulativeValues,
          smooth: true,
          lineStyle: { color: '#FFC000', width: 2 },
          itemStyle: { color: '#FFC000' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 192, 0, 0.3)' },
                { offset: 1, color: 'rgba(255, 192, 0, 0.1)' }
              ]
            }
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.cumulativeReturns = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 2. 回撤曲线
    renderDrawdownChart() {
      if (!this.$refs.drawdownChart) return;
      
      const chart = echarts.init(this.$refs.drawdownChart);
      
      // 计算回撤
      const drawdowns = [];
      let cumulative = 1;
      let maxCumulative = 1;
      
      for (const dr of this.dailyReturns) {
        cumulative *= (1 + dr);
        if (cumulative > maxCumulative) {
          maxCumulative = cumulative;
        }
        const drawdown = (cumulative / maxCumulative) - 1;
        drawdowns.push(drawdown);
      }
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.drawdown'),
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('tooltips.date', { date: data.axisValue })}<br/>${this.$t('charts.analysisCharts.drawdown')}: ${(data.value * 100).toFixed(2)}%`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: this.dates,
          axisLabel: { color: '#ccc', rotate: 45, fontSize: 10 },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            color: '#ccc',
            formatter: (value) => (value * 100).toFixed(1) + '%'
          },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.drawdown'),
          type: 'line',
          data: drawdowns,
          smooth: true,
          lineStyle: { color: '#ef5350', width: 2 },
          itemStyle: { color: '#ef5350' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(239, 83, 80, 0.3)' },
                { offset: 1, color: 'rgba(239, 83, 80, 0.1)' }
              ]
            }
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.drawdown = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 3. 滚动夏普比率
    renderRollingSharpeChart() {
      if (!this.$refs.rollingSharpeChart) return;
      
      const chart = echarts.init(this.$refs.rollingSharpeChart);
      
      const windowSize = 90; // 90天窗口
      const rollingSharpe = [];
      const rollingDates = [];
      
      for (let i = windowSize - 1; i < this.dailyReturns.length; i++) {
        const window = this.dailyReturns.slice(i - windowSize + 1, i + 1);
        const mean = window.reduce((a, b) => a + b, 0) / window.length;
        const variance = window.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / window.length;
        const stdDev = Math.sqrt(variance);
        
        if (stdDev === 0) {
          rollingSharpe.push(0);
        } else {
          const annualizedReturn = mean * 252;
          const annualizedVol = stdDev * Math.sqrt(252);
          rollingSharpe.push(annualizedReturn / annualizedVol);
        }
        rollingDates.push(this.dates[i]);
      }
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.rollingSharpe') + ` (${windowSize}D)`,
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('tooltips.date', { date: data.axisValue })}<br/>${this.$t('charts.analysisCharts.rollingSharpe')}: ${data.value.toFixed(3)}`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: rollingDates,
          axisLabel: { color: '#ccc', rotate: 45, fontSize: 10 },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#ccc' },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.rollingSharpe'),
          type: 'line',
          data: rollingSharpe,
          smooth: true,
          lineStyle: { color: '#42a5f5', width: 2 },
          itemStyle: { color: '#42a5f5' }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.rollingSharpe = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 4. 月度收益热力图
    renderMonthlyReturnsChart() {
      if (!this.$refs.monthlyReturnsChart) return;
      
      // 销毁已存在的图表实例
      const existingChart = echarts.getInstanceByDom(this.$refs.monthlyReturnsChart);
      if (existingChart) {
        existingChart.dispose();
      }
      
      const chart = echarts.init(this.$refs.monthlyReturnsChart);
      
      if (!this.dates || this.dates.length === 0 || !this.dailyReturns || this.dailyReturns.length === 0) {
        console.warn('No data available for monthly returns chart');
        return;
      }
      
      // 按月份分组计算收益
      const monthlyData = {};
      
      for (let i = 0; i < this.dates.length; i++) {
        // 解析日期字符串（支持 YYYY-MM-DD 格式）
        let date;
        try {
          date = new Date(this.dates[i]);
          // 如果日期无效，尝试其他格式
          if (isNaN(date.getTime())) {
            const dateStr = this.dates[i];
            if (dateStr.includes('-')) {
              const parts = dateStr.split('-');
              date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
              console.warn(`Invalid date format: ${this.dates[i]}`);
              continue;
            }
          }
        } catch (e) {
          console.warn(`Error parsing date: ${this.dates[i]}`, e);
          continue;
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const monthKey = `${year}-${month}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = [];
        }
        monthlyData[monthKey].push(this.dailyReturns[i]);
      }
      
      // 计算每月收益
      const monthlyReturns = {};
      Object.keys(monthlyData).forEach(monthKey => {
        const returns = monthlyData[monthKey];
        if (returns.length > 0) {
          let monthlyReturn = 1;
          for (const dr of returns) {
            monthlyReturn *= (1 + dr);
          }
          monthlyReturns[monthKey] = monthlyReturn - 1;
        }
      });
      
      if (Object.keys(monthlyReturns).length === 0) {
        console.warn('No monthly returns calculated');
        return;
      }
      
      // 准备热力图数据
      const years = [...new Set(Object.keys(monthlyReturns).map(k => k.split('-')[0]))].sort();
      const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      const heatmapData = [];
      
      // ECharts heatmap 需要的数据格式: [xIndex, yIndex, value]
      years.forEach((year, yearIndex) => {
        months.forEach((month, monthIndex) => {
          const key = `${year}-${month}`;
          const value = monthlyReturns[key];
          // 即使没有数据，也显示为 0（或者不显示，但这里我们显示所有月份）
          if (value !== undefined) {
            // heatmap 数据格式: [x轴索引, y轴索引, 值]
            heatmapData.push([monthIndex, yearIndex, value]);
          }
        });
      });
      
      if (heatmapData.length === 0) {
        console.warn('No heatmap data to display');
        return;
      }
      
      // 计算 visualMap 的范围
      const values = Object.values(monthlyReturns);
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      
      // 确保范围有效
      const visualMin = isNaN(minValue) ? -0.1 : minValue;
      const visualMax = isNaN(maxValue) ? 0.1 : maxValue;
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.monthlyReturns'),
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          position: 'top',
          formatter: (params) => {
            const monthIndex = params.data[0];
            const yearIndex = params.data[1];
            const value = params.data[2];
            const month = months[monthIndex];
            const year = years[yearIndex];
            return `${year}年${parseInt(month)}月<br/>${this.$t('charts.analysisCharts.monthlyReturn')}: ${(value * 100).toFixed(2)}%`;
          }
        },
        grid: {
          height: '60%',
          top: '15%',
          left: '10%',
          right: '10%'
        },
        xAxis: {
          type: 'category',
          data: months.map(m => parseInt(m)),
          splitArea: { show: true },
          axisLabel: { 
            color: '#ccc',
            formatter: (value) => {
              const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
              return monthNames[value - 1] || value;
            }
          },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'category',
          data: years,
          splitArea: { show: true },
          axisLabel: { color: '#ccc' },
          axisLine: { lineStyle: { color: '#666' } }
        },
        visualMap: {
          min: visualMin,
          max: visualMax,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '5%',
          inRange: {
            color: ['#ef5350', '#fff', '#4caf50']
          },
          textStyle: { color: '#ccc' },
          formatter: (value) => {
            return (value * 100).toFixed(1) + '%';
          }
        },
        series: [{
          name: this.$t('charts.analysisCharts.monthlyReturn'),
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (params) => {
              const value = params.data[2];
              return (value * 100).toFixed(1) + '%';
            },
            color: (params) => {
              // 根据值的大小调整文字颜色，确保可读性
              const value = params.data[2];
              return Math.abs(value) < 0.01 ? '#000' : '#fff';
            },
            fontSize: 11,
            fontWeight: 'bold'
          },
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              // hover时保持与正常状态一致的样式
              borderColor: '#333',
              borderWidth: 1
            }
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.monthlyReturns = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 5. 年度收益柱状图
    renderYearlyReturnsChart() {
      if (!this.$refs.yearlyReturnsChart) return;
      
      const chart = echarts.init(this.$refs.yearlyReturnsChart);
      
      // 按年份分组计算收益
      const yearlyData = {};
      let currentYear = null;
      let yearReturns = [];
      
      for (let i = 0; i < this.dates.length; i++) {
        const date = new Date(this.dates[i]);
        const year = date.getFullYear().toString();
        
        if (currentYear !== year) {
          if (currentYear !== null && yearReturns.length > 0) {
            let yearlyReturn = 1;
            for (const dr of yearReturns) {
              yearlyReturn *= (1 + dr);
            }
            yearlyData[currentYear] = yearlyReturn - 1;
          }
          currentYear = year;
          yearReturns = [];
        }
        yearReturns.push(this.dailyReturns[i]);
      }
      
      // 处理最后一年
      if (yearReturns.length > 0) {
        let yearlyReturn = 1;
        for (const dr of yearReturns) {
          yearlyReturn *= (1 + dr);
        }
        yearlyData[currentYear] = yearlyReturn - 1;
      }
      
      const years = Object.keys(yearlyData).sort();
      const returns = years.map(year => yearlyData[year]);
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.yearlyReturns'),
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${data.axisValue}<br/>${this.$t('charts.analysisCharts.yearlyReturn')}: ${(data.value * 100).toFixed(2)}%`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: years,
          axisLabel: { color: '#ccc' },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            color: '#ccc',
            formatter: (value) => (value * 100).toFixed(0) + '%'
          },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.yearlyReturn'),
          type: 'bar',
          data: returns,
          itemStyle: {
            color: (params) => {
              return params.value >= 0 ? '#4caf50' : '#ef5350';
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: (params) => {
              return (params.value * 100).toFixed(1) + '%';
            },
            color: '#fff',
            fontSize: 11
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.yearlyReturns = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 6. 收益分布图
    renderReturnDistributionChart() {
      if (!this.$refs.returnDistributionChart) return;
      
      const chart = echarts.init(this.$refs.returnDistributionChart);
      
      // 计算分布区间
      const min = Math.min(...this.dailyReturns);
      const max = Math.max(...this.dailyReturns);
      const range = max - min;
      const binCount = 30;
      const binSize = range / binCount;
      
      const bins = new Array(binCount).fill(0);
      const binLabels = [];
      
      for (let i = 0; i < binCount; i++) {
        const binStart = min + i * binSize;
        const binEnd = min + (i + 1) * binSize;
        binLabels.push(((binStart + binEnd) / 2 * 100).toFixed(2) + '%');
      }
      
      this.dailyReturns.forEach(dr => {
        const binIndex = Math.min(Math.floor((dr - min) / binSize), binCount - 1);
        bins[binIndex]++;
      });
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.returnDistribution'),
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('charts.analysisCharts.returnRange')}: ${data.axisValue}<br/>${this.$t('charts.analysisCharts.frequency')}: ${data.value}`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '15%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: binLabels,
          axisLabel: { 
            color: '#ccc', 
            rotate: 45, 
            fontSize: 9,
            interval: Math.floor(binCount / 10)
          },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          name: this.$t('charts.analysisCharts.frequency'),
          axisLabel: { color: '#ccc' },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.frequency'),
          type: 'bar',
          data: bins,
          itemStyle: {
            color: '#42a5f5'
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.returnDistribution = chart;
      
      window.addEventListener('resize', () => chart.resize());
    },

    // 7. 滚动波动率
    renderRollingVolatilityChart() {
      if (!this.$refs.rollingVolatilityChart) return;
      
      const chart = echarts.init(this.$refs.rollingVolatilityChart);
      
      const windowSize = 30; // 30天窗口
      const rollingVol = [];
      const rollingDates = [];
      
      for (let i = windowSize - 1; i < this.dailyReturns.length; i++) {
        const window = this.dailyReturns.slice(i - windowSize + 1, i + 1);
        const mean = window.reduce((a, b) => a + b, 0) / window.length;
        const variance = window.reduce((sum, dr) => sum + Math.pow(dr - mean, 2), 0) / window.length;
        const stdDev = Math.sqrt(variance);
        rollingVol.push(stdDev * Math.sqrt(252)); // 年化
        rollingDates.push(this.dates[i]);
      }
      
      const option = {
        title: {
          text: this.$t('charts.analysisCharts.rollingVolatility') + ` (${windowSize}D)`,
          left: 'center',
          textStyle: { color: '#FFC000', fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const data = params[0];
            return `${this.$t('tooltips.date', { date: data.axisValue })}<br/>${this.$t('charts.analysisCharts.rollingVolatility')}: ${(data.value * 100).toFixed(2)}%`;
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '10%',
          top: '15%'
        },
        xAxis: {
          type: 'category',
          data: rollingDates,
          axisLabel: { color: '#ccc', rotate: 45, fontSize: 10 },
          axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: {
          type: 'value',
          axisLabel: { 
            color: '#ccc',
            formatter: (value) => (value * 100).toFixed(1) + '%'
          },
          axisLine: { lineStyle: { color: '#666' } },
          splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
          name: this.$t('charts.analysisCharts.rollingVolatility'),
          type: 'line',
          data: rollingVol,
          smooth: true,
          lineStyle: { color: '#ffa726', width: 2 },
          itemStyle: { color: '#ffa726' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 167, 38, 0.3)' },
                { offset: 1, color: 'rgba(255, 167, 38, 0.1)' }
              ]
            }
          }
        }]
      };
      
      chart.setOption(option);
      this.analysisCharts.rollingVolatility = chart;
      
      window.addEventListener('resize', () => chart.resize());
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    
    // 销毁所有分析图表
    Object.values(this.analysisCharts).forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    });
    
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
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
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
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
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
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
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
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.chart-item {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid #444;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
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
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  border-radius: 8px;
  padding: 15px;
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.chart-item .chart-container canvas {
  max-width: 100% !important;
  height: auto !important;
}

/* Upload Section Styles */
.upload-section {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
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
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
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

/* Metrics Section Styles */
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

/* Analysis Charts Section Styles */
.analysis-charts-section {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  padding: 40px;
  border-radius: 10px;
  margin: 40px 0;
}

.analysis-charts-section h2 {
  text-align: center;
  color: #FFC000;
  margin-bottom: 40px;
  font-size: 2rem;
}

.analysis-chart-item {
  margin-bottom: 50px;
  background: rgba(13, 27, 42, 0.5);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255, 192, 0, 0.2);
}

.analysis-chart-item h3 {
  color: #FFC000;
  margin-bottom: 20px;
  font-size: 1.3rem;
  text-align: center;
}

.analysis-chart-container {
  width: 100%;
  height: 400px;
  min-height: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-charts-section {
    padding: 20px;
  }
  
  .analysis-chart-container {
    height: 300px;
    min-height: 300px;
  }
  
  .analysis-chart-item {
    padding: 15px;
  }
}

</style>
