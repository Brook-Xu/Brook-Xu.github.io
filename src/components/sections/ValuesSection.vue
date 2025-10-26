<template>
  <div class="section-content" ref="sectionRef">
    <h2 class="gradient-title">{{ $t('navigation.coreValues') }}</h2>
    <div class="values-content">
      <div class="values-container">
        <!-- 左侧图表区域 -->
        <div class="values-left" :class="{ 'fade-in-left': isVisible }" :style="{ animationDelay: isVisible ? '0.4s' : '0s' }">
          <FundChart />
        </div>
        
        <!-- 右侧下拉框区域 -->
        <div class="values-right" :class="{ 'fade-in-right': isVisible }" :style="{ animationDelay: isVisible ? '0.6s' : '0s' }">
          <div class="dropdown-container">
            <!-- 第一个价值观 -->
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 1, 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '0.8s' : '0s' }">
              <div class="dropdown-header" @click="toggleDropdown(1)">
                <div class="dropdown-title">
                  <div class="value-icon">✨</div>
                  <h3>{{ $t('home.value1.title') }}</h3>
                </div>
                <div class="dropdown-arrow" :class="{ 'hidden': activeDropdown === 1 }">
                  +
                </div>
              </div>
              <div class="dropdown-content" :class="{ 'expanded': activeDropdown === 1 }">
                <p>{{ $t('home.value1.description') }}</p>
              </div>
            </div>

            <!-- 第二个价值观 -->
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 2, 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '1.0s' : '0s' }">
              <div class="dropdown-header" @click="toggleDropdown(2)">
                <div class="dropdown-title">
                  <div class="value-icon">💼</div>
                  <h3>{{ $t('home.value2.title') }}</h3>
                </div>
                <div class="dropdown-arrow" :class="{ 'hidden': activeDropdown === 2 }">
                  +
                </div>
              </div>
              <div class="dropdown-content" :class="{ 'expanded': activeDropdown === 2 }">
                <p>{{ $t('home.value2.description') }}</p>
              </div>
            </div>

            <!-- 第三个价值观 -->
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 3, 'fade-in-item': isVisible }" :style="{ animationDelay: isVisible ? '1.2s' : '0s' }">
              <div class="dropdown-header" @click="toggleDropdown(3)">
                <div class="dropdown-title">
                  <div class="value-icon">🔍</div>
                  <h3>{{ $t('home.value3.title') }}</h3>
                </div>
                <div class="dropdown-arrow" :class="{ 'hidden': activeDropdown === 3 }">
                  +
                </div>
              </div>
              <div class="dropdown-content" :class="{ 'expanded': activeDropdown === 3 }">
                <p>{{ $t('home.value3.description') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FundChart from '../FundChart.vue';

export default {
  name: 'ValuesSection',
  components: {
    FundChart
  },
  data() {
    return {
      activeDropdown: 1, // 默认展开第一个下拉框
      isVisible: false,
      observer: null
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
    toggleDropdown(index) {
      // 如果点击的是当前展开的下拉框，则收起
      if (this.activeDropdown === index) {
        this.activeDropdown = null;
      } else {
        // 否则展开新的下拉框
        this.activeDropdown = index;
      }
    }
  }
};
</script>

<style scoped>
/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 1rem;
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

@keyframes fadeInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInFromRight {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
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

/* 左侧区域渐变出现 */
.fade-in-left {
  opacity: 0;
  animation: scaleIn 0.8s ease-out forwards;
}

/* 右侧区域从右侧淡入 */
.fade-in-right {
  opacity: 0;
  animation: fadeInFromRight 0.8s ease-out forwards;
}

/* 下拉框项目从右方淡入 */
.fade-in-item {
  opacity: 0;
  animation: fadeInFromRight 0.6s ease-out forwards;
}

/* 当动画需要重新播放时，重置状态 */
.values-left:not(.fade-in-left) {
  opacity: 0;
  transform: scale(0.8);
}

.values-right:not(.fade-in-right) {
  opacity: 0;
  transform: translateX(50px);
}

.dropdown-item:not(.fade-in-item) {
  opacity: 0;
  transform: translateX(50px);
}

/* 标题始终可见，无动画 */
.gradient-title {
  opacity: 1;
  transform: translateY(0);
}

/* 确保整个section有足够的高度 */
.section-content {
  min-height: 700px; /* 确保section有足够的最小高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: transparent; /* 使用父级背景色 */
}

.section-content h2 {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.values-container {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  width: 100%;
  box-sizing: border-box;
  min-height: 600px; /* 增加最小高度以容纳展开的下拉框 */
  padding: 0 2rem; /* 添加左右内边距 */
}

.values-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中对齐 */
  padding: 1rem;
  min-height: 500px; /* 确保有足够的高度显示图表 */
  border: 2px solid rgba(255, 192, 0, 0.3);
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.02);
  /* 初始隐藏状态 - 缩放效果 */
  opacity: 0;
  transform: scale(0.8);
}

.values-left :deep(.fund-chart-container) {
  width: 100%;
  height: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.values-left :deep(.chart-wrapper) {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.values-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中对齐 */
  padding-left: 1rem;
  /* 初始隐藏状态 - 从右侧开始 */
  opacity: 0;
  transform: translateX(50px);
}

/* 下拉框容器 */
.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0; /* 移除margin-top，让justify-content: center生效 */
}

/* 下拉框项目 */
.dropdown-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 192, 0, 0.2);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  margin-bottom: 1rem;
  /* 初始隐藏状态 - 从右方开始 */
  opacity: 0;
  transform: translateX(50px);
}

.dropdown-item:hover {
  border-color: #FFC000;
  box-shadow: 0 5px 15px rgba(255, 192, 0, 0.1);
}

.dropdown-item.active {
  border-color: #FFC000;
  box-shadow: 0 10px 30px rgba(255, 192, 0, 0.2);
}

/* 下拉框头部 */
.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-header:hover {
  background: rgba(255, 192, 0, 0.05);
}

.dropdown-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dropdown-arrow {
  font-size: 1.5rem;
  color: #FFC000;
  /* 收起时快速隐藏，展开时较慢显示 */
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  font-weight: bold;
  line-height: 1;
}

.dropdown-arrow:not(.hidden) {
  /* 展开时+号显示较慢 */
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-arrow.hidden {
  opacity: 0;
}

/* 下拉框内容 */
.dropdown-content {
  max-height: 0;
  overflow: hidden;
  /* 收起时使用快速动画 */
  transition: max-height 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
              padding 0.15s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.1s ease;
  padding: 0 1.5rem;
  opacity: 0;
}

.dropdown-content.expanded {
  max-height: 400px; /* 增加最大高度以容纳更多内容 */
  padding: 0 1.5rem 1.5rem 1.5rem;
  opacity: 1;
  /* 展开时使用较慢的动画 */
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
              padding 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s ease;
}

.dropdown-content p {
  color: #ccc;
  line-height: 1.6;
  margin: 0;
  text-align: left;
}

.value-icon {
  font-size: 2rem;
  margin: 0;
}

.dropdown-title h3 {
  color: #FFC000;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .section-content {
    padding: 20px 15px;
    min-height: auto; /* 移动端移除固定最小高度 */
  }
  
  .gradient-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .values-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 0.5rem; /* 移动端减少内边距 */
    min-height: auto;
  }
  
  .values-left {
    padding: 0.8rem;
    min-height: 350px; /* 移动端调整最小高度 */
    justify-content: center;
    flex: 1;
  }
  
  .values-left :deep(.chart-wrapper) {
    min-height: 300px;
  }
  
  .values-right {
    padding: 0;
    justify-content: center;
    flex: 1;
  }
  
  .dropdown-container {
    margin: 0;
  }
  
  .dropdown-header {
    padding: 1rem;
  }
  
  .dropdown-content.expanded {
    padding: 0 1rem 1rem 1rem;
    max-height: 300px; /* 移动端减小最大高度 */
  }
  
  .dropdown-title h3 {
    font-size: 1.3rem;
  }
  
  .value-icon {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .section-content {
    padding: 15px 10px;
  }
  
  .gradient-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .section-content h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .values-container {
    gap: 1.2rem;
    padding: 0;
  }
  
  .values-left {
    padding: 0.6rem;
    min-height: 300px; /* 小屏幕调整最小高度 */
  }
  
  .values-left :deep(.chart-wrapper) {
    min-height: 250px;
  }
  
  .dropdown-header {
    padding: 0.8rem;
  }
  
  .dropdown-content.expanded {
    padding: 0 0.8rem 0.8rem 0.8rem;
    max-height: 250px; /* 小屏幕进一步减小最大高度 */
  }
  
  .dropdown-title h3 {
    font-size: 1.1rem;
  }
  
  .value-icon {
    font-size: 1.5rem;
  }
  
  .dropdown-arrow {
    font-size: 1.2rem;
  }
}
</style>
