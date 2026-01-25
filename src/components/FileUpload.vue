<template>
  <div class="file-upload-container">
    <section class="upload-section" data-aos="fade-up">
      <h2>{{ $t('charts.uploadSection') }}</h2>
      <div class="upload-area">
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept=".csv,.xls,.xlsx" 
          :disabled="isProcessing"
        />
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
      <div v-if="isProcessing" class="processing-message">
        <div class="loading-spinner"></div>
        <p>{{ $t('charts.processingFile') }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default {
  name: 'FileUpload',
  data() {
    return {
      errorMessage: null,
      isProcessing: false
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        this.errorMessage = null;
        return;
      }

      const fileName = file.name.toLowerCase();
      this.errorMessage = null;
      this.isProcessing = true;

      // 检查文件类型
      if (fileName.endsWith('.csv')) {
        // 处理 CSV 文件
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              this.parseAndNavigate(results.data);
            } catch (error) {
              this.errorMessage = this.$t('charts.errorParsingCsv') + ': ' + error.message;
              this.isProcessing = false;
            }
          },
          error: (error) => {
            this.errorMessage = this.$t('charts.errorReadingCsv') + ': ' + error.message;
            this.isProcessing = false;
          }
        });
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        // 处理 Excel 文件
        this.parseExcelFile(file);
      } else {
        this.errorMessage = this.$t('charts.selectSupportedFile');
        this.isProcessing = false;
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
            defval: '',
            raw: false
          });
          
          if (!jsonData || jsonData.length === 0) {
            throw new Error(this.$t('charts.excelEmpty'));
          }
          
          // 使用与 CSV 相同的解析逻辑
          this.parseAndNavigate(jsonData);
        } catch (error) {
          this.errorMessage = this.$t('charts.errorParsingExcel') + ': ' + error.message;
          this.isProcessing = false;
        }
      };
      
      reader.onerror = () => {
        this.errorMessage = this.$t('charts.errorReadingExcel');
        this.isProcessing = false;
      };
      
      reader.readAsArrayBuffer(file);
    },

    parseAndNavigate(data) {
      try {
        // 解析数据，同时获取数据类型
        const { parsedData, dataType } = this.parseCSVData(data);
        
        // 将数据存储到 sessionStorage
        sessionStorage.setItem('chartData', JSON.stringify(parsedData));
        sessionStorage.setItem('rawData', JSON.stringify(data));
        sessionStorage.setItem('dataType', dataType); // 保存数据类型
        
        // 跳转到分析页面
        this.$router.push({
          name: 'Charts'
        });
      } catch (error) {
        this.errorMessage = error.message;
        this.isProcessing = false;
      }
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
        if (columnNames.includes('date')) {
          dateColumn = 'date';
        } else if (columnNames.includes('candle_begin_time')) {
          dateColumn = 'candle_begin_time';
        }

        if (columnNames.includes('cumulative_return')) {
          valueColumn = 'cumulative_return';
        } else if (columnNames.includes('daily_return')) {
          valueColumn = 'daily_return';
        }
      } else {
        // 原有的智能检测逻辑
        const firstColumnName = columnNames[0];
        const firstColumnValue = firstRow[firstColumnName];
        if (this.isDateColumn(firstColumnValue) || this.isDateColumnSlashFormat(firstColumnValue)) {
          dateColumn = firstColumnName;
          valueColumn = columnNames[1];
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
      let parsedData = data.map((row, index) => {
        const dateStr = row[dateColumn];
        const valueStr = row[valueColumn];

        // 验证并转换日期格式
        let normalizedDate = this.normalizeDate(dateStr);
        if (!normalizedDate) {
          throw new Error(this.$t('charts.invalidDateFormat', { row: index + 2, date: dateStr }));
        }

        // 验证数值（支持百分比格式）
        const value = this.parseNumericValue(valueStr);
        if (isNaN(value)) {
          throw new Error(this.$t('charts.invalidValue', { row: index + 2, value: valueStr }));
        }

        return {
          date: normalizedDate,
          value: value
        };
      });

      // 根据列名判断数据类型
      const isReturnType = valueColumn.toLowerCase().includes('_return');
      let dataType = 'price'; // 默认数据类型
      
      if (isReturnType) {
        const isDailyReturn = valueColumn.toLowerCase().includes('daily_return');
        const isCumulativeReturn = valueColumn.toLowerCase().includes('cumulative_return');
        
        if (isDailyReturn) {
          parsedData = this.convertDailyReturnToPriceSeries(parsedData);
          dataType = 'daily_return';
        } else if (isCumulativeReturn) {
          parsedData = this.convertCumulativeReturnToPriceSeries(parsedData);
          dataType = 'cumulative_return';
        } else {
          parsedData = this.convertCumulativeReturnToPriceSeries(parsedData);
          dataType = 'return';
        }
      }

      return { parsedData, dataType };
    },

    convertDailyReturnToPriceSeries(parsedData) {
      if (!parsedData || parsedData.length === 0) {
        return parsedData;
      }

      const priceSeries = [];
      let currentPrice = 1;

      for (const item of parsedData) {
        currentPrice = currentPrice * (1 + item.value);
        priceSeries.push({
          date: item.date,
          value: currentPrice
        });
      }

      return priceSeries;
    },

    convertCumulativeReturnToPriceSeries(parsedData) {
      if (!parsedData || parsedData.length === 0) {
        return parsedData;
      }

      return parsedData.map(item => ({
        date: item.date,
        value: 1 + item.value
      }));
    },

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
        const parts = trimmed.split('-');
        if (parts.length === 3) {
          const year = parts[0];
          const month = parts[1].padStart(2, '0');
          const day = parts[2].padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        return trimmed;
      }
      
      // 3. 尝试其他常见格式
      const usDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const usMatch = trimmed.match(usDateRegex);
      if (usMatch) {
        const [, month, day, year] = usMatch;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      const euDateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const euMatch = trimmed.match(euDateRegex);
      if (euMatch) {
        const [, part1, part2, year] = euMatch;
        const num1 = parseInt(part1);
        const num2 = parseInt(part2);
        if (num1 > 12 && num2 <= 12) {
          return `${year}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
        } else if (num1 <= 12 && num2 <= 12) {
          return `${year}-${part1.padStart(2, '0')}-${part2.padStart(2, '0')}`;
        }
      }
      
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

    /**
     * 解析数值字符串，支持百分比格式
     * 例如："0.12%" -> 0.0012, "12%" -> 0.12, "0.12" -> 0.12
     * @param {string|number} valueStr - 要解析的数值字符串
     * @returns {number} 解析后的数值（小数形式）
     */
    parseNumericValue(valueStr) {
      if (valueStr === null || valueStr === undefined || valueStr === '') {
        return NaN;
      }
      
      // 如果已经是数字，直接返回
      if (typeof valueStr === 'number') {
        return valueStr;
      }
      
      // 转换为字符串并去除空格
      const str = String(valueStr).trim();
      
      // 如果字符串以 % 结尾，去掉 % 并除以 100
      if (str.endsWith('%')) {
        const numStr = str.slice(0, -1).trim();
        const num = parseFloat(numStr);
        if (isNaN(num)) {
          return NaN;
        }
        return num / 100;
      }
      
      // 否则直接使用 parseFloat
      return parseFloat(str);
    },

    convertDateToStandardFormat(dateStr) {
      const parts = dateStr.split('/');
      if (parts.length !== 3) {
        return dateStr;
      }
      const year = parts[0];
      const month = parts[1].padStart(2, '0');
      const day = parts[2].padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    isDateColumn(value) {
      if (!value || typeof value !== 'string') return false;
      const dashRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
      return dashRegex.test(value.trim());
    },

    isDateColumnSlashFormat(value) {
      if (!value || typeof value !== 'string') return false;
      const dateRegex = /^\d{4}\/\d{1,2}\/\d{1,2}$/;
      return dateRegex.test(value.trim());
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
    }
  }
};
</script>

<style scoped>
.file-upload-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 20px 20px; /* 增加顶部边距，避免导航栏遮挡 */
}

.upload-section {
  background: transparent; /* 改为透明背景 */
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.upload-area {
  margin-top: 20px;
}

.upload-area input[type="file"] {
  display: block;
  margin: 20px 0;
  padding: 10px;
  border: 2px dashed rgba(255, 192, 0, 0.5); /* 改为金色虚线边框 */
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  background: rgba(13, 27, 42, 0.3); /* 添加半透明背景 */
  color: #eee; /* 文字颜色 */
}

.upload-area input[type="file"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.upload-section h2 {
  color: #FFC000; /* 标题颜色 */
  margin-bottom: 20px;
}

.upload-hint {
  color: #ccc; /* 改为浅色，适配透明背景 */
  font-size: 14px;
  margin: 10px 0;
}

.file-requirements {
  margin-top: 20px;
  padding: 20px;
  background: rgba(13, 27, 42, 0.5); /* 半透明深色背景 */
  border-radius: 4px;
  border: 1px solid rgba(255, 192, 0, 0.2); /* 添加边框 */
}

.file-requirements h4,
.file-requirements h5 {
  margin-top: 15px;
  margin-bottom: 10px;
  color: #FFC000; /* 改为金色标题 */
}

.file-requirements ul {
  margin-left: 20px;
  color: #ccc; /* 改为浅色文字 */
}

.file-requirements li {
  margin: 5px 0;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(204, 51, 51, 0.2); /* 半透明红色背景 */
  border: 1px solid rgba(204, 51, 51, 0.5);
  border-radius: 4px;
  color: #ff6b6b; /* 浅红色文字 */
}

.error-message h3 {
  color: #ff6b6b;
  margin-top: 0;
}

.processing-message {
  margin-top: 20px;
  padding: 20px;
  text-align: center;
  background: rgba(13, 27, 42, 0.5); /* 半透明深色背景 */
  border: 1px solid rgba(255, 192, 0, 0.3); /* 金色边框 */
  border-radius: 4px;
}

.loading-spinner {
  border: 4px solid rgba(255, 192, 0, 0.2); /* 半透明金色 */
  border-top: 4px solid #FFC000; /* 金色 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.processing-message p {
  color: #FFC000; /* 金色文字 */
  font-size: 16px;
  margin: 0;
}
</style>
