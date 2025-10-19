<template>
  <div class="section-content">
    <h2 class="gradient-title">{{ $t('navigation.coreValues') }}</h2>
    <div class="values-content">
      <div class="values-container">
        <!-- 左侧图表区域 -->
        <div class="values-left">
          <FundChart />
        </div>
        
        <!-- 右侧下拉框区域 -->
        <div class="values-right">
          <div class="dropdown-container">
            <!-- 第一个价值观 -->
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 1 }">
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
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 2 }">
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
            <div class="dropdown-item" :class="{ 'active': activeDropdown === 3 }">
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
      activeDropdown: 1 // 默认展开第一个下拉框
    };
  },
  methods: {
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
  .gradient-title {
    font-size: 2rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .values-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 1rem; /* 移动端减少内边距 */
  }
  
  .values-left {
    padding-right: 0;
    padding-bottom: 0; /* 移除padding-bottom，保持居中对齐 */
    justify-content: center; /* 移动端也保持居中对齐 */
    min-height: 400px; /* 移动端调整最小高度 */
    flex: 1; /* 移动端恢复等宽 */
  }
  
  .values-right {
    padding-left: 0;
    padding-top: 0; /* 移除padding-top，保持居中对齐 */
    justify-content: center; /* 移动端也保持居中对齐 */
    flex: 1; /* 移动端恢复等宽 */
  }
  
  .dropdown-container {
    margin: 0; /* 移动端也移除margin-top */
  }
  
  .dropdown-header {
    padding: 1rem;
  }
  
  .dropdown-content.expanded {
    padding: 0 1rem 1rem 1rem;
  }
}

@media (max-width: 480px) {
  .dropdown-header {
    padding: 0.8rem;
  }
  
  .dropdown-content.expanded {
    padding: 0 0.8rem 0.8rem 0.8rem;
  }
  
  .values-left {
    min-height: 300px; /* 小屏幕调整最小高度 */
  }
  
  .dropdown-title h3 {
    font-size: 1.3rem;
  }
  
  .value-icon {
    font-size: 1.5rem;
  }
}
</style>
