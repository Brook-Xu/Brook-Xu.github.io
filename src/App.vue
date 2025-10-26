<template>
  <div id="app">
    <Navigation ref="navigationComponent" @scroll-to-section="handleScrollToSection" />
    <router-view ref="homeComponent" @section-change="handleSectionChange" />
  </div>
</template>

<script>
import Navigation from './components/Navigation.vue';

export default {
  name: 'App',
  components: {
    Navigation
  },
  methods: {
    // 处理导航栏的滚动请求
    handleScrollToSection(anchor) {
      // 检查当前路由，如果是首页则滚动到对应section
      if (this.$route.path === '/') {
        // 将事件传递给Home组件
        this.$refs.homeComponent?.scrollToSection(anchor);
      } else {
        // 如果不是首页，先跳转到首页再滚动
        this.$router.push('/').then(() => {
          this.$nextTick(() => {
            this.$refs.homeComponent?.scrollToSection(anchor);
          });
        });
      }
    },
    
    // 处理section变化事件
    handleSectionChange(anchor) {
      // 将事件传递给Navigation组件
      this.$refs.navigationComponent?.updateActiveSection(anchor);
    }
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Montserrat', 'Arial', sans-serif;
  background: #153252;
  color: #eee;
  overflow-x: hidden; /* 防止横向滚动 */
}

/* 全局移动端优化 */
@media (max-width: 768px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
  
  /* 优化触摸区域 */
  button, a, .clickable {
    -webkit-tap-highlight-color: rgba(255, 192, 0, 0.2);
    min-height: 44px; /* iOS推荐的最小触摸目标 */
  }
}

@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
}
</style>
