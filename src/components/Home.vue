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
import AOS from 'aos';
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
          
          // 响应式配置 - 在所有屏幕尺寸都启用自动滚动
          // 注意：responsiveWidth 设置为 0 会完全禁用响应式模式
          // 这样所有设备（包括移动端）都会使用全屏滚动
          responsiveWidth: 0, // 完全启用fullpage在所有设备上
          responsiveHeight: 0, // 完全启用fullpage在所有设备上
          
          // 移动端支持触摸滑动
          touchSensitivity: 5, // 触摸灵敏度（默认值）
          continuousVertical: false, // 不连续滚动
          loopBottom: false, // 不循环到底部
          loopTop: false, // 不循环到顶部
          
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

/* 仅针对首页第一个 section（Hero）去除左右内边距与内容边距，便于视频全幅铺满 */
.section[data-anchor="home"] {
  padding-left: 0;
  padding-right: 0;
}

.section[data-anchor="home"] .section-content {
  padding: 0 !important;
  margin: 0 !important;
  max-width: none;
  width: 100%;
}

.section[data-anchor="values"] {
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%) !important; /* 更深的深蓝色渐变背景 */
}

.section[data-anchor="values"] .section-content {
  max-width: 1800px !important;
  width: 100% !important;
  padding: 0 !important;
  background: transparent !important; /* 确保内容区域透明，使用父级背景 */
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
  /* section应该占据完整的视口高度，因为fullpage已经有padding-top处理导航栏 */
  height: 100vh; 
  display: flex;
  align-items: flex-start; /* 改为从顶部开始对齐 */
  justify-content: center; /* 保持水平居中 */
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  overflow: hidden; /* 防止内部滚动 */
  padding-top: 0; /* 移除顶部内边距，因为fullpage已经有padding-top */
  padding-left: 20px; /* 添加左右内边距确保水平居中 */
  padding-right: 20px;
}

.section-content {
  max-width: 1200px;
  width: 100%;
  padding: 20px; /* 增加内边距 */
  text-align: center;
  height: 100%; /* 占满父容器高度 */
  max-height: 100%; /* 限制最大高度 */
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
    padding-top: 80px; /* 移动端减少顶部边距，为导航栏留出空间 */
  }
  
  .section {
    /* section应该占据完整的视口高度 */
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0; /* 移除顶部内边距 */
    padding-left: 15px;
    padding-right: 15px;
    padding-bottom: 0; /* 移除底部内边距 */
  }
  
  .section-content {
    padding: 15px;
    padding-top: 20px; /* 添加顶部内边距避免导航栏遮挡 */
    overflow: hidden;
    height: 100%;
    max-height: 100%;
  }
  
  /* 特殊处理首页 */
  .section[data-anchor="home"] {
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0;
  }
}

@media (max-width: 480px) {
  #fullpage {
    padding-top: 70px; /* 小屏幕进一步减少顶部边距 */
  }
  
  .section {
    /* section应该占据完整的视口高度 */
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 0;
  }
  
  .section-content {
    padding: 10px;
    padding-top: 15px; /* 添加顶部内边距避免导航栏遮挡 */
    overflow: hidden;
    height: 100%;
    max-height: 100%;
  }
  
  /* 特殊处理首页 */
  .section[data-anchor="home"] {
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0;
  }
}

/* 超小屏幕优化 */
@media (max-width: 360px) {
  #fullpage {
    padding-top: 65px; /* 超小屏幕进一步减少顶部边距 */
  }
  
  .section {
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0;
    padding-left: 8px;
    padding-right: 8px;
    padding-bottom: 0;
  }
  
  .section-content {
    padding: 8px;
    padding-top: 12px; /* 添加顶部内边距避免导航栏遮挡 */
  }
  
  .section[data-anchor="home"] {
    height: 100vh !important;
    padding-top: 0;
  }
}

/* 极超小屏幕优化 */
@media (max-width: 320px) {
  #fullpage {
    padding-top: 60px; /* 极超小屏幕进一步减少顶部边距 */
  }
  
  .section {
    height: 100vh !important; /* 完整视口高度 */
    padding-top: 0;
    padding-left: 5px;
    padding-right: 5px;
    padding-bottom: 0;
  }
  
  .section-content {
    padding: 5px;
    padding-top: 10px; /* 添加顶部内边距避免导航栏遮挡 */
  }
  
  .section[data-anchor="home"] {
    height: 100vh !important;
    padding-top: 0;
  }
}
</style>
