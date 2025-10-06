<template>
  <div>
    <h2>{{ $t('charts.title') }}</h2>
    <div ref="chart" style="width:600px;height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  mounted() {
    const chart = echarts.init(this.$refs.chart);
    chart.setOption({
      title: { text: this.$t('charts.dataTrendChart') },
      xAxis: { type: 'category', data: ['A','B','C','D'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [5,20,36,10] }]
    });
  }
};
</script>
