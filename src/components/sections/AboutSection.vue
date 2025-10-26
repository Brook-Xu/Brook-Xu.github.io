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
  position: absolute; /* 相对于section定位 */
  top: 0;
  left: -20px; /* 抵消父容器padding-left: 20px */
  right: -20px; /* 抵消父容器padding-right: 20px */
  width: calc(100% + 40px); /* 突破左右padding */
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
  display: flex;
  flex-direction: row; /* 默认横屏左右布局 */
  overflow: hidden;
}

/* 横屏PC端和宽屏：左右布局 */
.video-container {
  position: relative;
  width: 50%; /* 各占50%宽度 */
  height: 100%; /* 完整高度 */
  flex-shrink: 0;
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 100%;
  min-width: 100%; /* 确保最小宽度 */
  min-height: 100%; /* 确保最小高度 */
  object-fit: cover; /* 确保视频覆盖整个容器 */
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
  /* 移动端section padding为15px */
  .about-section {
    left: -15px; /* 抵消父容器padding-left: 15px */
    right: -15px; /* 抵消父容器padding-right: 15px */
    width: calc(100% + 30px); /* 突破左右padding */
  }
  
  /* 移动端竖屏：上下布局 */
  .video-background {
    flex-direction: column; /* 改为上下布局 */
  }
  
  .video-container {
    width: 100%; /* 各占100%宽度 */
    height: 50%; /* 各占50%高度 */
  }
  
  .section-content {
    padding: 30px 20px;
  }
  
  .gradient-title {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  .about-text p {
    font-size: 1.1rem;
    max-width: 100%;
    padding: 0 0.5rem;
    line-height: 1.6;
  }
  
  .about-description {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
  
  .about-details {
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
}

@media (max-width: 480px) {
  /* 小屏幕section padding为10px */
  .about-section {
    left: -10px; /* 抵消父容器padding-left: 10px */
    right: -10px; /* 抵消父容器padding-right: 10px */
    width: calc(100% + 20px); /* 突破左右padding */
  }
  
  /* 小屏幕竖屏：上下布局 */
  .video-background {
    flex-direction: column; /* 保持上下布局 */
  }
  
  .video-container {
    width: 100%; /* 各占100%宽度 */
    height: 50%; /* 各占50%高度 */
  }
  
  .section-content {
    padding: 20px 15px;
  }
  
  .gradient-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .section-content h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  .about-text p {
    font-size: 1rem;
    padding: 0;
    line-height: 1.5;
  }
  
  .about-description {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
  }
  
  .about-details {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  /* 小屏幕进一步增加遮罩层透明度 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
}

/* 横屏（landscape）时保持左右布局 */
@media screen and (max-height: 500px) {
  .video-background {
    flex-direction: row !important; /* 横屏时强制左右布局 */
  }
  
  .video-container {
    width: 50% !important; /* 各占50%宽度 */
    height: 100% !important; /* 完整高度 */
  }
}
</style>
