<template>
  <div class="about-section">
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
      <h2 class="gradient-title">{{ $t('navigation.aboutUs') }}</h2>
      <div class="about-content">
        <div class="about-text">
          <p class="about-description">{{ $t('about.description') }}</p>
          <p class="about-details">{{ $t('about.details') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入视频文件
import videoSrc from '../../assets/crypto_bg.mp4';

export default {
  name: 'AboutSection',
  data() {
    return {
      videoSrc: videoSrc
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
.about-section {
  position: relative;
  /* 使容器突破父级左右内边距，铺满整个视口宽度 */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  height: 100%;
  overflow: hidden;
  /* 确保突破父容器的内边距限制 */
  margin-top: -40px; /* 抵消父容器的padding-top */
  margin-bottom: 0;
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  /* 确保内容区域不受父容器内边距影响 */
  margin: 0;
  max-width: none;
  width: 100%;
}

/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #42b983, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.about-content {
  text-align: left;
}

.about-text p {
  font-size: 1.1rem;
  color: #ccc;
  margin-bottom: 1.5rem;
  line-height: 1.7;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.about-description {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.about-details {
  font-size: 1.1rem;
  line-height: 1.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .about-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    height: 100%;
  }
  
  .gradient-title {
    font-size: 2rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .about-text p {
    font-size: 1rem;
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .about-description {
    font-size: 1.1rem;
  }
  
  .about-details {
    font-size: 1rem;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.6);
  }
}

@media (max-width: 480px) {
  .about-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    height: 100%;
  }
  
  .gradient-title {
    font-size: 1.8rem;
  }
  
  .about-text p {
    font-size: 0.95rem;
    padding: 0 0.5rem;
  }
  
  .about-description {
    font-size: 1rem;
  }
  
  .about-details {
    font-size: 0.95rem;
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

/* 强制突破父容器限制，确保视频背景完全铺满 */
.about-section {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1;
}
</style>
