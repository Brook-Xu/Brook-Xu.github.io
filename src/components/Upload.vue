<template>
  <section class="upload" data-aos="fade-up">
    <h2>Upload CSV / Excel</h2>
    <input type="file" @change="handleFileUpload" />
    <pre v-if="jsonData">{{ jsonData }}</pre>
  </section>
</template>

<script>
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export default {
  data() {
    return { jsonData: null };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            this.jsonData = results.data;
          }
        });
      } else if (file.name.endsWith('.xlsx')) {
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          this.jsonData = XLSX.utils.sheet_to_json(worksheet);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }
};
</script>
