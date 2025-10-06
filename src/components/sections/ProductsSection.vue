<template>
  <div class="section-content">
    <h2>{{ $t('navigation.products') }}</h2>
    <div class="products-content">
      <div class="products-grid">
        <div class="product-item" data-aos="fade-up" data-aos-delay="100">
          <div class="product-icon">📈</div>
          <h3>{{ $t('home.product1.title') }}</h3>
          <p>{{ $t('home.product1.description') }}</p>
          <ul>
            <li>{{ $t('home.product1.feature1') }}</li>
            <li>{{ $t('home.product1.feature2') }}</li>
            <li>{{ $t('home.product1.feature3') }}</li>
          </ul>
        </div>
        <div class="product-item" data-aos="fade-up" data-aos-delay="200">
          <div class="product-icon">📊</div>
          <h3>{{ $t('home.product2.title') }}</h3>
          <p>{{ $t('home.product2.description') }}</p>
          <ul>
            <li>{{ $t('home.product2.feature1') }}</li>
            <li>{{ $t('home.product2.feature2') }}</li>
            <li>{{ $t('home.product2.feature3') }}</li>
          </ul>
        </div>
        <div class="product-item" data-aos="fade-up" data-aos-delay="300">
          <div class="product-icon">🤖</div>
          <h3>{{ $t('home.product3.title') }}</h3>
          <p>{{ $t('home.product3.description') }}</p>
          <ul>
            <li>{{ $t('home.product3.feature1') }}</li>
            <li>{{ $t('home.product3.feature2') }}</li>
            <li>{{ $t('home.product3.feature3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductsSection'
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.product-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(66, 185, 131, 0.2);
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.product-item:hover {
  transform: translateY(-5px);
  border-color: #42b983;
  box-shadow: 0 10px 30px rgba(66, 185, 131, 0.2);
}

.product-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.product-item h3 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.product-item p {
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.product-item ul {
  list-style: none;
  padding: 0;
}

.product-item li {
  color: #ccc;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.product-item li:before {
  content: "✓";
  color: #42b983;
  font-weight: bold;
  margin-right: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-content h2 {
    font-size: 2rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .product-item {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .product-item {
    padding: 1rem;
  }
}
</style>
