<template>
  <div class="section-content">
    <h2 class="gradient-title">{{ $t('navigation.productsTitle') }}</h2>
    <div class="products-content">
      <div class="products-grid">
        <div class="product-item">
          <div class="product-icon">🔄</div>
          <h3>{{ $t('home.product1.title') }}</h3>
          <ul class="product-features">
            <li>{{ $t('home.product1.feature1') }}</li>
            <li>{{ $t('home.product1.feature2') }}</li>
            <li>{{ $t('home.product1.feature3') }}</li>
          </ul>
          <div class="more-container">
            <div class="more-button" @click="handleMoreClick('product1')">
              More >>
            </div>
          </div>
        </div>
        <div class="product-item">
          <div class="product-icon">📈</div>
          <h3>{{ $t('home.product2.title') }}</h3>
          <ul class="product-features">
            <li>{{ $t('home.product2.feature1') }}</li>
            <li>{{ $t('home.product2.feature2') }}</li>
            <li>{{ $t('home.product2.feature3') }}</li>
          </ul>
        </div>
        <div class="product-item">
          <div class="product-icon">📊</div>
          <h3>{{ $t('home.product3.title') }}</h3>
          <ul class="product-features">
            <li>{{ $t('home.product3.feature1') }}</li>
            <li>{{ $t('home.product3.feature2') }}</li>
            <li>{{ $t('home.product3.feature3') }}</li>
          </ul>
          <div class="more-container">
            <div class="more-button" @click="handleMoreClick('product3')">
              More >>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductsSection',
  methods: {
    handleMoreClick(productType) {
      if (productType === 'product1') {
        // 跳转到加密货币策略页面
        this.$router.push('/crypto-strategies');
      } else {
        // TODO: 后续可以自定义其他产品的跳转链接
        console.log(`Clicked more button for ${productType}`);
        // 示例：可以根据productType跳转到不同链接
        // window.open('https://example.com/' + productType, '_blank');
      }
    }
  }
};
</script>

<style scoped>
.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.product-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 192, 0, 0.2);
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  position: relative;
}

.product-item:hover {
  transform: translateY(-5px);
  border-color: #FFC000;
  box-shadow: 0 10px 30px rgba(255, 192, 0, 0.2);
}

.product-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.product-item h3 {
  color: #FFC000;
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
  content: "◆";
  color: #FFC000;
  font-weight: bold;
  margin-right: 0.5rem;
}

.product-features {
  list-style: none;
  padding: 0;
  margin: 1rem 0 4rem 0;
}

.product-features li {
  color: #ccc;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  line-height: 1.4;
}

.more-container {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  text-align: right;
}

.more-button {
  display: inline-block;
  color: #FFC000;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: blink 3s ease-in-out infinite;
  text-decoration: none;
  background: rgba(255, 192, 0, 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 192, 0, 0.3);
}

.more-button:hover {
  background: rgba(255, 192, 0, 0.2);
  border-color: #FFC000;
  transform: scale(1.05);
  animation: none;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  75% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .gradient-title {
    font-size: 2rem;
  }
  
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
  
  .more-button {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
  }
  
  .more-container {
    margin-top: 1rem;
  }
}
</style>
