<template>
  <div class="about-section">
    <!-- 视频背景 -->
    <div class="video-background">
      <div class="video-container video-left-container">
        <video 
          ref="backgroundVideo1"
          autoplay 
          muted 
          loop 
          playsinline
          class="background-video video-left"
        >
          <source :src="videoSrc" type="video/mp4">
          您的浏览器不支持视频播放。
        </video>
        <div class="video-overlay"></div>
      </div>
      <div class="video-container video-right-container">
        <video 
          ref="backgroundVideo2"
          autoplay 
          muted 
          loop 
          playsinline
          class="background-video video-right"
        >
          <source :src="videoSrc" type="video/mp4">
          您的浏览器不支持视频播放。
        </video>
        <div class="video-overlay"></div>
      </div>
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
      const video1 = this.$refs.backgroundVideo1;
      const video2 = this.$refs.backgroundVideo2;
      
      // 设置第一个视频
      if (video1) {
        video1.muted = true;
        video1.loop = true;
        video1.playsInline = true;
        video1.play().catch(error => {
          console.log('视频1自动播放被阻止:', error);
        });
      }
      
      // 设置第二个视频
      if (video2) {
        video2.muted = true;
        video2.loop = true;
        video2.playsInline = true;
        video2.play().catch(error => {
          console.log('视频2自动播放被阻止:', error);
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
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
}

.video-container {
  position: relative;
  width: 50vw;
  height: 50vw;
  flex-shrink: 0;
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.video-left {
  object-position: right center;
  transform: rotate(90deg);
  transform-origin: center center;
}

.video-right {
  object-position: left center;
  transform: rotate(270deg);
  transform-origin: center center;
}

/* 视频遮罩层，用于降低视频亮度，确保文字可读性 */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
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
  color: #FFC000;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  color: #FFC000;
  margin-bottom: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.about-content {
  text-align: left;
}

.about-text p {
  font-size: 1.3rem;
  color: #ccc;
  margin-bottom: 1.5rem;
  line-height: 1.7;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.about-description {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
}

.about-details {
  font-size: 1.3rem;
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
    font-size: 1.2rem;
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .about-description {
    font-size: 1.3rem;
  }
  
  .about-details {
    font-size: 1.2rem;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.3);
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
    font-size: 1.1rem;
    padding: 0 0.5rem;
  }
  
  .about-description {
    font-size: 1.2rem;
  }
  
  .about-details {
    font-size: 1.1rem;
  }
  
  /* 小屏幕进一步增加遮罩层透明度 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
}

/* 确保视频在移动设备上正确显示 */
@media (max-width: 1024px) {
  .video-background {
    display: flex;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }
  
  .video-container {
    width: 50vw;
    height: 50vw;
    flex-shrink: 0;
    overflow: hidden;
  }
  
  .background-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .video-left {
    object-position: right center;
    transform: rotate(90deg);
    transform-origin: center center;
  }
  
  .video-right {
    object-position: left center;
    transform: rotate(270deg);
    transform-origin: center center;
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
