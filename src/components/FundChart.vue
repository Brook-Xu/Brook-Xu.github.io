<template>
  <div class="fund-chart-container">
    <div ref="chartContainer" class="chart-wrapper"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import ohlcData from '../assets/ohlc_data.js';

export default {
  name: 'FundChart',
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
      
      this.loading = false;
    },
    
    initChart() {
      if (!this.$refs.chartContainer) return;
      
      this.chart = echarts.init(this.$refs.chartContainer);
      
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
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          show: false,
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
            show: false
          }
        },
        yAxis: {
          type: 'value',
          scale: true,
          show: false,
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
            show: false
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
            animationDuration: 3000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
              return idx * 30; // 每个蜡烛图依次出现，间隔30ms
            }
          }
        ],
        animation: true,
        animationDuration: 3000,
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
        this.chart.resize();
      }
    },
    
    startFirstAnimation() {
      // 开始第一次绘制动画
      if (this.chart) {
        this.chart.setOption({
          series: [{
            data: this.chartData,
            animation: true,
            animationDuration: 3000,
            animationEasing: 'cubicOut',
            animationDelay: function (idx) {
              return idx * 30; // 每个蜡烛图间隔30ms出现
            }
          }]
        });
      }
    },
    
    startLoopAnimation() {
      // 每6秒重新播放一次动画
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
                animationDuration: 3000,
                animationEasing: 'cubicOut',
                animationDelay: function (idx) {
                  return idx * 30; // 每个蜡烛图间隔30ms出现
                }
              }]
            });
          }, 100);
        }
      }, 6000);
    }
  }
};
</script>

<style scoped>
.fund-chart-container {
  width: 100%;
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
  min-height: 400px;
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
    min-height: 300px;
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    min-height: 250px;
  }
}
</style>
