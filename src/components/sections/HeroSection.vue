<template>
  <div class="section-content">
    <div class="hero" data-aos="fade-up">
      <h1>{{ $t('home.title') }}</h1>
      <p v-if="$t('home.subtitle')">{{ $t('home.subtitle') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection'
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

.hero {
  text-align: center;
  padding: 0 20px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #42b983;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero p {
  font-size: 1.3rem;
  color: #ccc;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .section-content h2 {
    font-size: 2rem;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 1.5rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
}
</style>
