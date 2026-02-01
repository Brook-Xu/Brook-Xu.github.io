<template>
  <div class="management-team-section">
    <!-- 视频背景 - 单个视频铺满整个section -->
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
      <div class="video-overlay"></div>
    </div>
    
    <!-- 内容区域 -->
    <div class="section-content">
      <h2 class="gradient-title">{{ $t('navigation.managementTeam') }}</h2>
      <div class="team-content">
        <div class="team-wrapper">
          <div class="team-image-container">
            <img :src="managerImage" alt="Management Team" class="team-image" />
          </div>
          <div class="team-text-container">
            <ul class="team-list">
              <li>{{ $t('managementTeam.item1') }}</li>
              <li>{{ $t('managementTeam.item2') }}</li>
              <li>{{ $t('managementTeam.item3') }}</li>
              <li>{{ $t('managementTeam.item4') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入视频文件
import videoSrc from '../../assets/crypto_bg.mp4';
// 导入管理团队图片
import managerImage from '../../assets/manager.jpg';

export default {
  name: 'ManagementTeamSection',
  data() {
    return {
      videoSrc: videoSrc,
      managerImage: managerImage
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
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play().catch(error => {
          console.log('视频自动播放被阻止:', error);
        });
      }
    }
  }
};
</script>

<style scoped>
/* 视频背景容器 */
.management-team-section {
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
  overflow: hidden;
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保视频覆盖整个容器 */
  object-position: center;
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

.team-content {
  text-align: center;
  max-width: 1200px;
  width: 100%;
}

.team-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.team-image-container {
  flex: 0 0 auto;
  width: 300px;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid rgba(255, 192, 0, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.team-image-container:hover {
  border-color: #FFC000;
  box-shadow: 0 15px 40px rgba(255, 192, 0, 0.3);
  transform: translateY(-5px);
}

.team-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.team-text-container {
  flex: 1 1 400px;
  text-align: left;
  max-width: 600px;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list li {
  color: #ccc;
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 1.2rem;
  padding-left: 1.5rem;
  position: relative;
}

.team-list li::before {
  content: '•';
  color: #FFC000;
  font-size: 1.5rem;
  position: absolute;
  left: 0;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 移动端section padding为15px */
  .management-team-section {
    left: -15px; /* 抵消父容器padding-left: 15px */
    right: -15px; /* 抵消父容器padding-right: 15px */
    width: calc(100% + 30px); /* 突破左右padding */
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
  
  .team-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .team-image-container {
    width: 250px;
    height: 330px;
  }
  
  .team-text-container {
    max-width: 100%;
    text-align: left;
  }
  
  .team-list li {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.4);
  }
}

@media (max-width: 480px) {
  /* 小屏幕section padding为10px */
  .management-team-section {
    left: -10px; /* 抵消父容器padding-left: 10px */
    right: -10px; /* 抵消父容器padding-right: 10px */
    width: calc(100% + 20px); /* 突破左右padding */
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
  
  .team-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .team-image-container {
    width: 200px;
    height: 270px;
  }
  
  .team-text-container {
    max-width: 100%;
    text-align: left;
  }
  
  .team-list li {
    font-size: 1rem;
    margin-bottom: 0.8rem;
    line-height: 1.6;
  }
  
  /* 小屏幕进一步增加遮罩层透明度 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
}

</style>
