<template>
  <div class="hero-section">
    <!-- 视频背景 -->
    <div class="video-background">
      <video 
        ref="backgroundVideo"
        autoplay 
        muted 
        loop 
        playsinline
        class="background-video"
      >
        <source :src="videoSrc" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>
      <!-- 视频遮罩层 -->
      <div class="video-overlay"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="section-content">
      <div class="hero" data-aos="fade-up">
        <h1 class="hero-title" :class="{ 'animate-text': showTextAnimation }">
          <template v-if="isEnglish">
            <span class="line" :class="{ 'animate-line': showTextAnimation }">Unleash growth</span>
            <span class="line" :class="{ 'animate-line': showTextAnimation }" style="animation-delay: 0.5s;">with diverse strategies</span>
          </template>
          <template v-else>
            <span class="line" :class="{ 'animate-line': showTextAnimation }">{{ $t('home.title') }}</span>
          </template>
        </h1>
        <p v-if="$t('home.subtitle')" class="hero-subtitle" :class="{ 'animate-subtitle': showTextAnimation }">{{ $t('home.subtitle') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// 直接导入 src/assets 中的视频文件
import videoSrc from '../../assets/starnet_bg_1.mp4';

export default {
  name: 'HeroSection',
  data() {
    return {
      videoSrc: videoSrc,
      showTextAnimation: false
    };
  },
  computed: {
    isEnglish() {
      return (this.$i18n && this.$i18n.locale === 'en');
    }
  },
  mounted() {
    // 确保视频在移动设备上也能正常播放
    this.setupVideo();
    
    // 每次进入页面都展示动画效果
    this.$nextTick(() => {
      // 延迟启动以等待布局稳定
      setTimeout(() => {
        this.showTextAnimation = true;
      }, 400);
    });
  },
  methods: {
    setupVideo() {
      const video = this.$refs.backgroundVideo;
      if (video) {
        // 设置视频播放属性
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        
        // 尝试播放视频
        video.play().catch(error => {
          console.log('视频自动播放被阻止:', error);
          // 如果自动播放失败，可以添加用户交互来启动播放
        });
      }
    }
  }
};
</script>

<style scoped>
/* 视频背景容器 */
.hero-section {
  position: relative;
  /* 使容器突破父级左右内边距，铺满整个视口宽度 */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  height: 100%;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* 视频遮罩层，用于降低视频亮度，确保文字可读性 */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
  pointer-events: none;
}

/* 内容区域 */
.section-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-content h2 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero {
  text-align: center;
}

/* 调大字体，并拆分两行 */
.hero-title {
  margin: 0 0 1rem 0;
  color: #42b983;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  font-size: 4rem; /* 统一字体大小，适用于所有语言 */
  opacity: 0;
  transform: translateY(30px);
  filter: blur(8px);
  transition: transform 1.1s ease-out, opacity 1.1s ease-out, filter 1.1s ease-out;
}

.hero-title.animate-text {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
}

.hero-title .line {
  display: block;
  font-size: inherit; /* 继承父元素字体大小 */
  opacity: 0;
  transform: translateY(20px);
  filter: blur(6px);
  /* 使用clip-path做遮罩滑出 */
  clip-path: inset(0 100% 0 0);
  transition: transform 0.9s ease-out, opacity 0.9s ease-out, filter 0.9s ease-out;
}

.hero-title .line.animate-line {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
  animation: revealLine 1.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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

.hero-subtitle {
  opacity: 0;
  transform: translateY(20px);
  filter: blur(6px);
  letter-spacing: 0.2em;
  transition: transform 1.0s ease-out, opacity 1.0s ease-out, filter 1.0s ease-out, letter-spacing 1.3s ease;
  transition-delay: 0.8s;
}

.hero-subtitle.animate-subtitle {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
  letter-spacing: 0.02em;
}

/* 线条遮罩滑出动画（从右到左揭示） */
@keyframes revealLine {
  0% { clip-path: inset(0 100% 0 0); }
  100% { clip-path: inset(0 0 0 0); }
}


/* 响应式设计 */
@media (max-width: 768px) {
  .hero-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    height: 100%;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .hero-title {
    font-size: 3.2rem;
  }
  
  .hero p {
    font-size: 1.2rem;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.6);
  }
}

@media (max-width: 480px) {
  .hero-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    height: 100%;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  /* 小屏幕进一步增加遮罩层透明度 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}

/* 确保视频在移动设备上正确显示 */
@media (max-width: 1024px) {
  .background-video {
    object-fit: cover;
    object-position: center center;
  }
}
</style>
