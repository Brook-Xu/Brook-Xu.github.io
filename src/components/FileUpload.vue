<template>
  <div class="file-upload-container">
    <section class="upload-section" data-aos="fade-up">
      <h2>{{ $t('charts.uploadSection') }}</h2>
      <div class="upload-area">
        <input 
          type="file" 
          @change="handleFileUpload" 
          accept=".csv" 
          :disabled="isProcessing"
        />
        <p class="upload-hint">{{ $t('charts.uploadHint') }}</p>
        <div class="file-requirements">
          <h4>{{ $t('charts.fileRequirements') }}</h4>
          <ul>
            <li>{{ $t('charts.csvOnly') }}</li>
            <li>{{ $t('charts.mustHaveHeader') }}</li>
            <li>{{ $t('charts.minTwoColumns') }}</li>
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
            <li>{{ $t('charts.columnNames.special') }}</li>
            <li><em>{{ $t('charts.columnNames.note') }}</em></li>
          </ul>
          
          <h5>{{ $t('charts.supportedValueFormats') }}</h5>
          <ul>
            <li v-for="format in $t('charts.valueFormats')" :key="format">{{ format }}</li>
          </ul>
          
          <h5>{{ $t('charts.supportedDataTypes') }}</h5>
          <ul>
            <li v-for="type in $t('charts.dataTypes')" :key="type">{{ type }}</li>
          </ul>
          
        </div>
      </div>
      <div v-if="errorMessage" class="error-message">
        <h3>{{ $t('common.error') }}</h3>
        <p class="error-details">{{ errorMessage }}</p>
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
      } else {
        this.errorMessage = this.$t('charts.selectSupportedFile');
        this.isProcessing = false;
        return;
      }
    },


    parseAndNavigate(data) {
      try {
        // 添加调试日志
        console.log('parseAndNavigate - input data:', {
          dataLength: data.length,
          columnNames: data.length > 0 ? Object.keys(data[0]) : [],
          firstRow: data[0],
          secondRow: data[1]
        });
        
        // 解析数据，同时获取数据类型
        const { parsedData, dataType } = this.parseCSVData(data);
        
        console.log('parseAndNavigate - parsed data:', {
          parsedDataLength: parsedData.length,
          dataType: dataType,
          firstParsedRow: parsedData[0]
        });
        
        // 将数据存储到 sessionStorage
        sessionStorage.setItem('chartData', JSON.stringify(parsedData));
        sessionStorage.setItem('rawData', JSON.stringify(data));
        sessionStorage.setItem('dataType', dataType); // 保存数据类型
        
        // 跳转到分析页面
        this.$router.push({
          name: 'Charts'
        });
      } catch (error) {
        console.error('parseAndNavigate error:', error);
        // 确保错误信息完整显示，包括堆栈信息
        const fullErrorMessage = error.message || error.toString();
        this.errorMessage = fullErrorMessage;
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
      
      console.log('parseCSVData - column detection:', {
        totalRows: data.length,
        columnNames: columnNames,
        firstRow: firstRow,
        columnCount: columnNames.length
      });
      
      if (columnNames.length < 2) {
        const errorMsg = this.$t('charts.csvMinColumns') + 
          `\n检测到的列数: ${columnNames.length}` +
          `\n列名: ${columnNames.join(', ') || '无'}`;
        throw new Error(errorMsg);
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
          
          // 查找数值列 - 改进的查找策略（支持关键词匹配和兜底逻辑）
          const candidateValueColumns = [];
          
          // 第一步：收集所有包含关键词的数值列（优先匹配）
          for (const colName of columnNames) {
            if (colName !== dateColumn && this.isValueColumnName(colName)) {
              const columnType = this.detectValueColumnType(colName);
              candidateValueColumns.push({
                name: colName,
                type: columnType.type,
                confidence: columnType.confidence,
                hasKeyword: true // 标记为包含关键词
              });
            }
          }
          
          // 第二步：如果找到包含关键词的列，按置信度排序选择
          if (candidateValueColumns.length > 0) {
            candidateValueColumns.sort((a, b) => {
              const confidenceOrder = { 'high': 3, 'medium': 2, 'low': 1 };
              return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
            });
            valueColumn = candidateValueColumns[0].name;
          } else {
            // 第三步：如果没有找到包含关键词的列，使用排除法
            // 排除日期列后的所有列都作为候选数值列
            const nonDateColumns = columnNames.filter(col => col !== dateColumn);
            
            if (nonDateColumns.length > 0) {
              // 如果有多个非日期列，检查这些列的数据是否看起来像数值
              for (const colName of nonDateColumns) {
                // 检查前几行数据，判断是否为数值（跳过可能的空值）
                let foundNumericValue = false;
                for (let i = 0; i < Math.min(5, data.length); i++) {
                  const value = data[i][colName];
                  if (value !== null && value !== undefined && value !== '') {
                    const numValue = this.parseNumericValue(value);
                    if (!isNaN(numValue)) {
                      // 这个列包含数值，可以作为数值列
                      valueColumn = colName;
                      foundNumericValue = true;
                      console.log(`使用排除法找到数值列: ${colName}，样本值: ${value}`);
                      break;
                    }
                  }
                }
                if (foundNumericValue) break;
              }
              
              // 如果还是没找到，直接使用第一个非日期列（兜底）
              // 即使数据看起来不像数值，也尝试使用（可能是特殊格式）
              if (!valueColumn && nonDateColumns.length > 0) {
                valueColumn = nonDateColumns[0];
                console.log(`使用兜底逻辑，选择第一个非日期列: ${valueColumn}`);
              }
            }
          }
          
          // 如果没找到日期列，使用第一列作为日期
          if (!dateColumn) {
            dateColumn = columnNames[0];
          }
          
          // 最终兜底：如果还是没找到数值列，使用排除日期列后的第一个列
          if (!valueColumn) {
            const fallbackColumn = columnNames.find(col => col !== dateColumn);
            if (fallbackColumn) {
              valueColumn = fallbackColumn;
              console.log(`使用最终兜底逻辑，选择列: ${valueColumn}`);
            } else if (columnNames.length > 1) {
              valueColumn = columnNames[1];
            }
          }
        }
      }

      // 验证找到的列
      if (!dateColumn || !valueColumn) {
        // 添加详细的调试信息
        const debugInfo = {
          columnNames: columnNames,
          dateColumn: dateColumn,
          valueColumn: valueColumn,
          firstRow: firstRow,
          sampleData: data.slice(0, 3) // 前3行数据样本
        };
        console.error('Column identification failed:', debugInfo);
        
        // 最后的尝试：如果找到了日期列但没找到数值列，使用排除法
        if (dateColumn && !valueColumn) {
          const remainingColumns = columnNames.filter(col => col !== dateColumn);
          if (remainingColumns.length > 0) {
            valueColumn = remainingColumns[0];
            console.log(`最后尝试：使用排除法选择数值列: ${valueColumn}`);
          }
        }
        
        // 如果还是没有找到，抛出错误
        if (!dateColumn || !valueColumn) {
          const errorMsg = this.$t('charts.cannotIdentifyColumns') + 
            `\n检测到的列名: ${columnNames.join(', ')}` +
            `\n日期列: ${dateColumn || '未找到'}` +
            `\n数值列: ${valueColumn || '未找到'}` +
            `\n请检查文件格式是否正确，第一行是否为表头。`;
          throw new Error(errorMsg);
        }
      }
      
      console.log('列识别成功:', {
        dateColumn: dateColumn,
        valueColumn: valueColumn,
        allColumns: columnNames
      });

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

      // 根据列名判断数据类型 - 使用改进的检测方法
      const columnTypeInfo = this.detectValueColumnType(valueColumn);
      let dataType = columnTypeInfo.type;
      
      // 根据检测到的数据类型进行相应的转换
      if (dataType === 'daily_return') {
        parsedData = this.convertDailyReturnToPriceSeries(parsedData);
      } else if (dataType === 'cumulative_return' || dataType === 'return') {
        parsedData = this.convertCumulativeReturnToPriceSeries(parsedData);
        dataType = 'cumulative_return'; // 统一为 cumulative_return
      }
      // price 类型不需要转换，直接使用

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
      const lowerName = columnName.toLowerCase().trim();
      
      // 扩展的数值列关键词列表，按优先级分类
      const valueKeywords = [
        // 通用数值关键词
        'value', '数值', '数据', 'data',
        // 价格相关关键词
        'price', '价格', 'close', '收盘', 'open', '开盘', 'high', '最高', 'low', '最低',
        // 净值相关关键词
        'nav', '净值', 'net', 'netvalue', 'net_value',
        // 金额/数量相关关键词
        'amount', '金额', 'quantity', '数量', 'count', '计数', 'number', '数字',
        // 收益率相关关键词（这些会被特殊处理）
        'return', '收益', '收益率', 'yield', '回报', '回报率',
        'daily_return', '日收益', '日收益率',
        'cumulative_return', '累计收益', '累计收益率',
        'total_return', '总收益', '总收益率',
        // 其他常见金融术语
        'pnl', '盈亏', 'profit', '利润', 'loss', '亏损',
        'balance', '余额', 'equity', '权益',
        'volume', '成交量', 'vol', '量',
        // 其他可能的数值列名
        'val', 'val_', 'value_', 'price_', 'price_', 'amt', 'qty'
      ];
      
      // 检查是否包含任何关键词
      return valueKeywords.some(keyword => lowerName.includes(keyword));
    },
    
    /**
     * 根据列名判断数据类型，返回更详细的数据类型信息
     * @param {string} columnName - 列名
     * @returns {object} 包含数据类型和置信度的对象
     */
    detectValueColumnType(columnName) {
      if (!columnName) return { type: 'price', confidence: 'low' };
      
      const lowerName = columnName.toLowerCase().trim();
      
      // 收益率类型（高优先级）
      if (lowerName.includes('daily_return') || lowerName.includes('日收益')) {
        return { type: 'daily_return', confidence: 'high' };
      }
      if (lowerName.includes('cumulative_return') || lowerName.includes('累计收益')) {
        return { type: 'cumulative_return', confidence: 'high' };
      }
      if (lowerName.includes('total_return') || lowerName.includes('总收益')) {
        return { type: 'cumulative_return', confidence: 'medium' };
      }
      if (lowerName.includes('return') || lowerName.includes('收益') || lowerName.includes('收益率')) {
        // 需要进一步判断是日收益还是累计收益，默认按累计收益处理
        return { type: 'return', confidence: 'medium' };
      }
      
      // 净值类型
      if (lowerName.includes('nav') || lowerName.includes('净值') || 
          lowerName.includes('netvalue') || lowerName.includes('net_value')) {
        return { type: 'price', confidence: 'high' };
      }
      
      // 价格类型
      if (lowerName.includes('price') || lowerName.includes('价格') ||
          lowerName.includes('close') || lowerName.includes('收盘') ||
          lowerName.includes('open') || lowerName.includes('开盘')) {
        return { type: 'price', confidence: 'high' };
      }
      
      // 默认按价格处理
      return { type: 'price', confidence: 'medium' };
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

.error-details {
  white-space: pre-wrap; /* 保留换行符和空格 */
  word-wrap: break-word; /* 长单词自动换行 */
  margin: 10px 0 0 0;
  line-height: 1.6;
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
