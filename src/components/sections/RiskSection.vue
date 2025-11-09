<template>
  <div class="section-content" ref="sectionRef">
    <h2 class="gradient-title" :class="{ 'fade-in-title': isVisible }">{{ $t('navigation.riskManagement') }}</h2>
    <div class="risk-content">
      <div class="risk-grid">
        <div class="risk-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.2s' : '0s' }">
          <div class="risk-icon">
            <img :src="risk1Img" alt="risk1" />
          </div>
          <h3>{{ $t('home.risk1.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk1.point1') }}</li>
            <li>{{ $t('home.risk1.point2') }}</li>
          </ul>
        </div>
        <div class="risk-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.4s' : '0s' }">
          <div class="risk-icon">
            <img :src="risk2Img" alt="risk2" />
          </div>
          <h3>{{ $t('home.risk2.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk2.point1') }}</li>
            <li>{{ $t('home.risk2.point2') }}</li>
            <li>{{ $t('home.risk2.point3') }}</li>
          </ul>
        </div>
        <div class="risk-item" :class="{ 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.6s' : '0s' }">
          <div class="risk-icon">
            <img :src="risk3Img" alt="risk3" />
          </div>
          <h3>{{ $t('home.risk3.title') }}</h3>
          <ul class="risk-bullets">
            <li>{{ $t('home.risk3.point1') }}</li>
            <li>{{ $t('home.risk3.point2') }}</li>
            <li>{{ $t('home.risk3.point3') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import risk1Img from '../../assets/risk1.jpg';
import risk2Img from '../../assets/risk2.jpg';
import risk3Img from '../../assets/risk3.jpg';

export default {
  name: 'RiskSection',
  data() {
    return {
      isVisible: false,
      observer: null,
      risk1Img,
      risk2Img,
      risk3Img
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
    }
  }
};
</script>

<style scoped>
.section-content {
  padding-top: 1rem;
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
  margin-bottom: 1rem;
  margin-top: 0.5rem;
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

/* 风险项目淡入动画 */
.fade-in-item {
  opacity: 0;
  animation: fadeInFromBottom 0.8s ease-out forwards;
}

/* 当动画需要重新播放时，重置状态 */
.risk-item:not(.fade-in-item) {
  opacity: 0;
  transform: translateY(50px);
}

/* 初始状态 - 元素在动画触发前是隐藏的 */
.gradient-title {
  opacity: 0;
  transform: translateY(-20px);
}

.risk-item {
  opacity: 0;
  transform: translateY(50px);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 1rem;
  margin-top: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.risk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 1400px;
  box-sizing: border-box;
}

.risk-item {
  background: linear-gradient(135deg, rgba(255, 192, 0, 0.15), rgba(255, 192, 0, 0.05));
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 192, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  /* 确保所有模块高度一致 */
  display: flex;
  flex-direction: column;
  height: 100%;
  text-align: left;
}

.risk-item:hover {
  transform: translateY(-5px);
  border-color: #FFC000;
  box-shadow: 0 10px 30px rgba(255, 192, 0, 0.2);
}

.risk-icon {
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

.risk-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.risk-item h3 {
  color: #FFC000;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  margin-top: 0;
  text-align: left;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.risk-item p {
  color: #ccc;
  line-height: 1.6;
  text-align: left;
  flex-grow: 1;
  margin: 0;
}

.risk-bullets {
  color: #ccc;
  line-height: 1.6;
  text-align: left;
  flex-grow: 1;
  margin: 0;
  padding-left: 1rem;
  list-style: none;
  font-size: 1.1rem;
}

.risk-bullets li {
  position: relative;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
}

.risk-bullets li::before {
  content: "·";
  position: absolute;
  left: 0;
  color: #ccc;
  font-weight: bold;
  font-size: 1.2em;
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .risk-grid {
    max-width: 1200px;
    gap: 2rem;
  }
}

@media (max-width: 1200px) {
  .risk-grid {
    max-width: 1000px;
    gap: 1.8rem;
  }
}

@media (max-width: 1024px) {
  .risk-grid {
    grid-template-columns: repeat(2, 1fr);
    max-width: 800px;
    gap: 1.5rem;
  }
  
  .risk-item h3 {
    white-space: normal;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .section-content {
    padding: 20px 15px 10px;
  }
  
  .gradient-title {
    font-size: 2rem;
    margin-bottom: 1.2rem;
    margin-top: 1rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
    margin-bottom: 1.2rem;
    margin-top: 1rem;
  }
  
  .risk-grid {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-top: 0.3rem;
  }
  
  .risk-item {
    padding: 1.2rem;
  }
  
  .risk-icon {
    display: none;
  }
  
  .risk-item h3 {
    font-size: 1.1rem;
    white-space: normal;
    margin-bottom: 0.8rem;
  }
  
  .risk-bullets {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .section-content {
    padding: 15px 10px 8px;
  }
  
  .gradient-title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
    margin-top: 0.8rem;
  }
  
  .section-content h2 {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
    margin-top: 0.8rem;
  }
  
  .risk-grid {
    gap: 1rem;
  }
  
  .risk-item {
    padding: 1rem;
  }
  
  .risk-icon {
    display: none;
  }
  
  .risk-item h3 {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
  
  .risk-bullets {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}
</style>
