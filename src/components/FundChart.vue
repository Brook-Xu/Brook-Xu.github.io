<template>
  <div class="fund-chart-container">
    <div ref="chartContainer" class="chart-wrapper"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

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
        // 加载OHLC数据
        const response = await fetch('./ohlc_data.json');
        const ohlcData = await response.json();
        
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
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          show: false // 屏蔽鼠标hover时的数据弹窗
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '2%',
          top: '2%',
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
            data: this.chartData,
            itemStyle: {
              color: '#42b983',      // 上涨颜色
              color0: '#ff6b6b',     // 下跌颜色
              borderColor: '#42b983',
              borderColor0: '#ff6b6b'
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
