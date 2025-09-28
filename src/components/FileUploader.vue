<template>
  <div>
    <h2>文件上传解析</h2>
    <input type="file" @change="handleFile" />
    <pre>{{ parsedData }}</pre>
  </div>
</template>

<script>
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export default {
  data() {
    return { parsedData: [] };
  },
  methods: {
    handleFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          complete: results => {
            this.parsedData = results.data;
          }
        });
      } else if (file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = evt => {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          this.parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        };
        reader.readAsArrayBuffer(file);
      }
    }
  }
};
</script>
