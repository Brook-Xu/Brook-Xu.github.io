<template>
  <div class="fund-chart-container" :style="{ width: width, height: height }">
    <div ref="chartContainer" class="chart-wrapper"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import ohlcData from '../assets/ohlc_data.js';

export default {
  name: 'FundChart',
  props: {
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '400px'
    }
  },
  data() {
    return {
      chart: null,
      chartData: [],
      loading: true,
      animationTimer: null
    };
  },
  mounted() {
    this.loadData();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  },
  methods: {
    async loadData() {
      try {
        // 直接使用本地导入的OHLC数据
        this.processData(ohlcData);
        this.initChart();
      } catch (error) {
        console.error('Error loading chart data:', error);
        this.loading = false;
      }
    },
    
    processData(data) {
      // 将OHLC数据转换为蜡烛图格式
      this.chartData = data.map((item) => {
        const date = new Date(item.date);
        
        return [
          date.getTime(), // 时间戳
          item.open,      // 开盘价
          item.close,     // 收盘价
          item.low,       // 最低价
          item.high       // 最高价
        ];
      });
      
      // 根据数据点数量计算动画参数
      const dataCount = this.chartData.length;
      const delayPerItem = 30; // 每个蜡烛图间隔30ms
      const baseDuration = 2000; // 基础动画时长2秒
      // 总动画时长 = 基础时长 + 最后一个元素的延迟时间
      this.totalAnimationDuration = baseDuration + (dataCount * delayPerItem);
      // 循环间隔 = 总动画时长 + 1秒缓冲时间
      this.loopInterval = this.totalAnimationDuration + 1000;
      
      this.loading = false;
    },
    
    initChart() {
      if (!this.$refs.chartContainer) return;
      
      // 响应式设置图表宽度和高度
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const chartWidth = isMobile ? (window.innerWidth - 80) : 700;
      const chartHeight = isSmallMobile ? 180 : (isMobile ? 220 : 500);
      
      this.chart = echarts.init(this.$refs.chartContainer, null, {
        width: chartWidth,  // 设置图表宽度
        height: chartHeight  // 设置图表高度
      });
      
      // 确保图表容器大小正确
      this.$nextTick(() => {
        if (this.chart) {
          this.chart.resize();
        }
      });
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          show: false // 屏蔽鼠标hover时的数据弹窗
        },
        grid: {
          left: '10%',
          right: '5%',
          bottom: '12%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          show: true,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 192, 0, 0.15)',
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          show: true,
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255, 192, 0, 0.15)',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '基金净值',
            type: 'candlestick',
            data: [], // 初始为空数组，让图表从空状态开始
            itemStyle: {
              color: '#4caf50',      // 上涨颜色 - 柔和绿色
              color0: '#f44336',     // 下跌颜色 - 柔和红色
              borderColor: '#4caf50',
              borderColor0: '#f44336'
            },
            emphasis: {
              itemStyle: {
                color: '#4fc3f7',
                color0: '#ff8a80',
                borderColor: '#4fc3f7',
                borderColor0: '#ff8a80'
              }
            },
            animation: true,
            animationDuration: this.totalAnimationDuration || 3000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
              return idx * 30; // 每个蜡烛图依次出现，间隔30ms
            }
          }
        ],
        animation: true,
        animationDuration: this.totalAnimationDuration || 3000,
        animationEasing: 'cubicOut'
      };
      
      this.chart.setOption(option);
      
      // 延迟一点时间后开始第一次绘制动画
      setTimeout(() => {
        this.startFirstAnimation();
      }, 100);
      
      // 添加持续循环动画
      this.startLoopAnimation();
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', this.handleResize);
    },
    
    handleResize() {
      if (this.chart) {
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        const chartWidth = isMobile ? (window.innerWidth - 80) : 700;
        const chartHeight = isSmallMobile ? 180 : (isMobile ? 220 : 500);
        
        this.chart.resize({
          width: chartWidth,
          height: chartHeight
        });
      }
    },
    
    startFirstAnimation() {
      // 开始第一次绘制动画
      if (this.chart) {
        this.chart.setOption({
          series: [{
            data: this.chartData,
            animation: true,
            animationDuration: this.totalAnimationDuration || 3000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
              return idx * 30; // 每个蜡烛图间隔30ms出现
            }
          }]
        });
      }
    },
    
    startLoopAnimation() {
      // 根据数据量动态计算循环间隔，确保动画完成后再开始下一轮
      const loopInterval = this.loopInterval || 6000;
      
      this.animationTimer = setInterval(() => {
        if (this.chart) {
          // 先清空数据
          this.chart.setOption({
            series: [{
              data: []
            }]
          });
          
          // 延迟100ms后重新设置数据，触发从左到右的动画
          setTimeout(() => {
            this.chart.setOption({
              series: [{
                data: this.chartData,
                animation: true,
                animationDuration: this.totalAnimationDuration || 3000,
                animationEasing: 'cubicOut',
                animationDelay: function (idx) {
                  return idx * 30; // 每个蜡烛图间隔30ms出现
                }
              }]
            });
          }, 100);
        }
      }, loopInterval);
    }
  }
};
</script>

<style scoped>
.fund-chart-container {
  width: 100%; /* 可以改为具体数值，如 800px, 90%, 等 */
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border-radius: 15px;
  border: none;
  overflow: hidden;
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrapper canvas {
  max-width: 100% !important;
  max-height: 100% !important;
  width: 100% !important;
  height: 100% !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chart-wrapper {
    min-height: 0;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    min-height: 0;
  }
}
</style>
