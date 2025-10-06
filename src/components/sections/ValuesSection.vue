<template>
  <div class="section-content">
    <h2>{{ $t('navigation.coreValues') }}</h2>
    <div class="values-content">
      <div class="values-grid">
        <div class="value-item" data-aos="fade-up" data-aos-delay="100">
          <div class="value-icon">🎯</div>
          <h3>{{ $t('home.value1.title') }}</h3>
          <p>{{ $t('home.value1.description') }}</p>
        </div>
        <div class="value-item" data-aos="fade-up" data-aos-delay="200">
          <div class="value-icon">🔬</div>
          <h3>{{ $t('home.value2.title') }}</h3>
          <p>{{ $t('home.value2.description') }}</p>
        </div>
        <div class="value-item" data-aos="fade-up" data-aos-delay="300">
          <div class="value-icon">🚀</div>
          <h3>{{ $t('home.value3.title') }}</h3>
          <p>{{ $t('home.value3.description') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValuesSection'
};
</script>

<style scoped>
.section-content h2 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.value-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(66, 185, 131, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.value-item:hover {
  transform: translateY(-5px);
  border-color: #42b983;
  box-shadow: 0 10px 30px rgba(66, 185, 131, 0.2);
}

.value-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.value-item h3 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.value-item p {
  color: #ccc;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-content h2 {
    font-size: 2rem;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .value-item {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .value-item {
    padding: 1rem;
  }
}
</style>
