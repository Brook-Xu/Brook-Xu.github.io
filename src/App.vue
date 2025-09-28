<template>
  <div class="app animate__animated animate__fadeIn">
    <h1>我的官网</h1>
    <p>这里是官网的介绍信息。</p>

    <StockFetcher />
    <FileUploader />
    <Chart />
  </div>
</template>

<script>
import StockFetcher from './components/StockFetcher.vue';
import FileUploader from './components/FileUploader.vue';
import Chart from './components/Chart.vue';

export default {
  components: { StockFetcher, FileUploader, Chart }
};
</script>

<style>
body {
  font-family: sans-serif;
  margin: 20px;
}
</style>
