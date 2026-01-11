<template>
  <div class="section-content" ref="sectionRef">
    <h2 class="gradient-title" :class="{ 'fade-in-title': isVisible }">{{ $t('navigation.productsTitle') }}</h2>
    <div class="products-content">
      <div class="products-grid">
        <div class="product-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.2s' : '0s' }">
          <div class="product-icon">
            <img :src="strategiesImg" alt="strategies" />
          </div>
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
        <div class="product-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.4s' : '0s' }">
          <div class="product-icon">
            <img :src="cryptoImg" alt="crypto" />
          </div>
          <h3>{{ $t('home.product2.title') }}</h3>
          <ul class="product-features">
            <li>{{ $t('home.product2.feature1') }}</li>
            <li>{{ $t('home.product2.feature2') }}</li>
            <li>{{ $t('home.product2.feature3') }}</li>
          </ul>
        </div>
        <div class="product-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.6s' : '0s' }">
          <div class="product-icon">
            <img :src="dataImg" alt="data" />
          </div>
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
import strategiesImg from '../../assets/strategies.jpg';
import cryptoImg from '../../assets/crypto.jpg';
import dataImg from '../../assets/data.jpg';

export default {
  name: 'ProductsSection',
  data() {
    return {
      isVisible: false,
      observer: null,
      strategiesImg,
      cryptoImg,
      dataImg
    };
  },
  mounted() {
    this.setupIntersectionObserver();
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // 当元素距离视口底部100px时触发
        threshold: 0.1 // 当10%的元素可见时触发
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 重置动画状态
            this.isVisible = false;
            // 使用nextTick确保DOM更新后再触发动画
            this.$nextTick(() => {
              this.isVisible = true;
            });
          } else {
            // 当元素离开视口时重置状态，为下次进入做准备
            this.isVisible = false;
          }
        });
      }, options);

      if (this.$refs.sectionRef) {
        this.observer.observe(this.$refs.sectionRef);
      }
    },
    handleMoreClick(productType) {
      if (productType === 'product1') {
        // 跳转到加密货币策略页面
        this.$router.push('/crypto-strategies');
      } else if (productType === 'product3') {
        // 跳转到文件上传页面
        this.$router.push('/upload');
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

/* 动画关键帧 */
@keyframes fadeInFromBottom {
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInTitle {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 标题淡入动画 */
.fade-in-title {
  animation: fadeInTitle 0.8s ease-out forwards;
}

/* 产品项目淡入动画 */
.fade-in-item {
  opacity: 0;
  animation: fadeInFromBottom 0.8s ease-out forwards;
}

/* 当动画需要重新播放时，重置状态 */
.product-item:not(.fade-in-item) {
  opacity: 0;
  transform: translateY(50px);
}

/* 初始状态 - 元素在动画触发前是隐藏的 */
.gradient-title {
  opacity: 0;
  transform: translateY(-20px);
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
  background: linear-gradient(135deg, rgba(255, 192, 0, 0.15), rgba(255, 192, 0, 0.05));
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 192, 0, 0.2);
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  position: relative;
  /* 初始隐藏状态 */
  opacity: 0;
  transform: translateY(50px);
}

.product-item:hover {
  transform: translateY(-5px);
  border-color: #FFC000;
  box-shadow: 0 10px 30px rgba(255, 192, 0, 0.2);
}

.product-icon {
  margin-bottom: 1rem;
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.product-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
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
  .section-content {
    padding: 15px 8px;
  }
  
  .gradient-title {
    font-size: 1.6rem;
    margin-bottom: 0.75rem;
  }
  
  .section-content h2 {
    font-size: 1.6rem;
    margin-bottom: 0.75rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin-top: 0.3rem;
  }
  
  .product-item {
    padding: 1rem 0.9rem;
  }
  
  .product-item h3 {
    font-size: 1.15rem;
    margin-bottom: 0.75rem;
  }
  
  .product-icon {
    display: none;
  }
  
  .product-features {
    margin: 0.5rem 0 1rem 0;
  }
  
  .product-features li {
    padding: 0.5rem 0;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .more-container {
    bottom: 0.7rem;
    right: 0.7rem;
  }
  
  .more-button {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .section-content {
    padding: 12px 6px;
  }
  
  .gradient-title {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .section-content h2 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  
  .products-grid {
    gap: 0.6rem;
    margin-top: 0.2rem;
  }
  
  .product-item {
    padding: 0.8rem;
  }
  
  .product-item h3 {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
  
  .product-icon {
    display: none;
  }
  
  .product-features {
    margin: 0.4rem 0 0.8rem 0;
  }
  
  .product-features li {
    padding: 0.4rem 0;
    font-size: 0.9rem;
    line-height: 1.35;
  }
  
  .more-button {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
  
  .more-container {
    bottom: 0.5rem;
    right: 0.5rem;
  }
}
</style>
