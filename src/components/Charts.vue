<template>
  <section class="charts" data-aos="fade-up">
    <h2>Stock Prices Chart</h2>
    <div ref="chart" style="width:100%;height:400px;"></div>
  </section>
</template>

<script>
import * as echarts from 'echarts';

export default {
  mounted() {
    const chart = echarts.init(this.$refs.chart);
    chart.setOption({
      title: { text: 'Sample Data' },
      tooltip: {},
      xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: {},
      series: [{ type: 'line', data: [820, 932, 901, 934, 1290] }]
    });
  }
};
</script>
