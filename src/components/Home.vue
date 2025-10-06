<template>
  <div id="fullpage">
    <!-- 使用独立的section组件 -->
    <div class="section" data-anchor="home">
      <HeroSection @scroll-to-section="scrollToSection" />
    </div>
    <div class="section" data-anchor="about">
      <AboutSection />
    </div>
    <div class="section" data-anchor="values">
      <ValuesSection />
    </div>
    <div class="section" data-anchor="products">
      <ProductsSection />
    </div>
    <div class="section" data-anchor="risk">
      <RiskSection />
    </div>
    <div class="section" data-anchor="partners">
      <PartnersSection />
    </div>
    <div class="section" data-anchor="contact">
      <ContactSection />
    </div>
  </div>
</template>

<script>
import fullpage from 'fullpage.js';
import HeroSection from './sections/HeroSection.vue';
import AboutSection from './sections/AboutSection.vue';
import ValuesSection from './sections/ValuesSection.vue';
import ProductsSection from './sections/ProductsSection.vue';
import RiskSection from './sections/RiskSection.vue';
import PartnersSection from './sections/PartnersSection.vue';
import ContactSection from './sections/ContactSection.vue';

export default {
  name: 'Home',
  components: {
    HeroSection,
    AboutSection,
    ValuesSection,
    ProductsSection,
    RiskSection,
    PartnersSection,
    ContactSection
  },
  data() {
    return { 
      fullpageInstance: null
    };
  },
  mounted() {
    this.initFullPage();
  },
  beforeDestroy() {
    if (this.fullpageInstance) {
      this.fullpageInstance.destroy('all');
    }
  },
  methods: {
    // 初始化fullPage.js
    initFullPage() {
      this.$nextTick(() => {
        this.fullpageInstance = new fullpage('#fullpage', {
          // 基本配置
          licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
          scrollingSpeed: 1000,
          autoScrolling: true,
          fitToSection: true,
          fitToSectionDelay: 1000,
          
          // 导航配置
          navigation: false,
          
          // 滚动配置
          scrollBar: false,
          easingcss3: 'ease',
          easing: 'easeInOutCubic',
          
          // 响应式配置
          responsiveWidth: 768,
          responsiveHeight: 600,
          
          // 回调函数
          onLeave: (origin, destination, direction) => {
            // 更新导航栏活动状态
            this.updateNavigationState(destination.anchor);
          },
          
          afterLoad: (origin, destination, direction) => {
            // 重新初始化AOS动画
            this.$nextTick(() => {
              AOS.refresh();
            });
          }
        });
      });
    },

    // 滚动到指定section
    scrollToSection(anchor) {
      if (this.fullpageInstance) {
        this.fullpageInstance.moveTo(anchor);
      }
    },

    // 更新导航栏状态
    updateNavigationState(anchor) {
      // 通过事件总线通知导航栏更新状态
      this.$emit('section-change', anchor);
    },

  }
};
</script>

<style>
/* fullPage.js 基础样式 */
#fullpage {
  position: relative;
  /* 确保导航栏始终可见，增加更多顶部边距 */
  padding-top: 100px; /* 增加顶部边距，避免导航栏遮盖内容 */
}

/* fullPage.js 自动生成的overflow容器样式 */
.fp-overflow {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  height: 100% !important;
}

.section {
  position: relative;
  width: 100%;
  height: calc(100vh - 100px); /* 减去增加的顶部边距 */
  display: flex;
  align-items: flex-start; /* 改为从顶部开始对齐 */
  justify-content: center; /* 保持水平居中 */
  background: linear-gradient(135deg, #153252 0%, #1e3a5f 100%);
  overflow: hidden; /* 防止内部滚动 */
  padding-top: 40px; /* 直接添加顶部内边距 */
  padding-left: 20px; /* 添加左右内边距确保水平居中 */
  padding-right: 20px;
}

.section-content {
  max-width: 1200px;
  width: 100%;
  padding: 20px; /* 增加内边距 */
  text-align: center;
  height: auto; /* 改为自动高度 */
  max-height: calc(100vh - 180px); /* 限制最大高度，为顶部边距留出空间 */
  overflow-x: hidden; /* 防止横向滚动 */
  overflow-y: hidden; /* 完全禁止内部滚动，强制内容适配 */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* 改为从顶部开始排列 */
  box-sizing: border-box; /* 确保padding包含在宽度内 */
  margin: 0 auto; /* 确保内容在容器内水平居中 */
}

/* 隐藏 fullPage.js 的 "made with" 标记 */
.fp-watermark {
  display: none !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #fullpage {
    padding-top: 80px; /* 移动端减少顶部边距 */
  }
  
  .section {
    height: calc(100vh - 80px);
    padding-top: 30px; /* 移动端减少section顶部内边距 */
    padding-left: 15px; /* 移动端调整左右内边距 */
    padding-right: 15px;
  }
  
  .section-content {
    padding: 15px;
    max-height: calc(100vh - 140px); /* 调整最大高度 */
  }
}

@media (max-width: 480px) {
  #fullpage {
    padding-top: 70px; /* 小屏幕进一步减少顶部边距 */
  }
  
  .section {
    height: calc(100vh - 70px);
    padding-top: 20px; /* 小屏幕进一步减少section顶部内边距 */
    padding-left: 10px; /* 小屏幕调整左右内边距 */
    padding-right: 10px;
  }
  
  .section-content {
    padding: 10px;
    max-height: calc(100vh - 110px); /* 调整最大高度 */
  }
}
</style>
