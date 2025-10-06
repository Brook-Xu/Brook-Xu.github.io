<template>
  <div>
    <h2>{{ $t('marketData.sp500') }}</h2>
    <button @click="fetchData">{{ $t('common.refresh') }}</button>
    <ul>
      <li v-for="(item, index) in prices" :key="index">
        {{ item.time }}: {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { prices: [] };
  },
  methods: {
    async fetchData() {
      try {
        const res = await fetch('https://api.coindesk.com/v1/bpi/historical/close.json');
        const data = await res.json();
        this.prices = Object.entries(data.bpi).map(([time, value]) => ({ time, value }));
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>
