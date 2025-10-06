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
        <h1>{{ $t('home.title') }}</h1>
        <p v-if="$t('home.subtitle')">{{ $t('home.subtitle') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      videoSrc: '/assets/starnet_bg_1.mp4'
    };
  },
  mounted() {
    // 确保视频在移动设备上也能正常播放
    this.setupVideo();
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
  padding: 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #42b983;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  
  .hero h1 {
    font-size: 2rem;
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
  
  .hero h1 {
    font-size: 1.5rem;
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
