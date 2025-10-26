<template>
  <div class="contact-section">
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

    <div class="section-content">
      <h2 class="gradient-title">{{ $t('navigation.contactUs') }}</h2>
      <div class="contact-content">
        <div class="contact-grid">
          <div class="contact-info">
            <div class="contact-item">
              <div class="contact-icon">💬</div>
              <div class="contact-details">
                <h4>Telegram</h4>
                <p>starnetcapitalDan</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">📧</div>
              <div class="contact-details">
                <h4>Email</h4>
                <p>Xing@starnetdigital.cc</p>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-icon">🔗</div>
              <div class="contact-details">
                <h4>LinkedIn</h4>
                <p><a class="external-link" href="https://www.linkedin.com/company/105309831/" target="_blank" rel="noopener noreferrer">https://www.linkedin.com/company/105309831/</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoSrc from '../../assets/bg_3.mp4';

export default {
  name: 'ContactSection',
  data() {
    return {
      videoSrc: videoSrc
    };
  },
  mounted() {
    const video = this.$refs.backgroundVideo;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.play().catch(err => console.log('视频自动播放被阻止:', err));
    }
  }
};
</script>

<style scoped>
.contact-section {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  height: 100%;
  overflow: hidden;
  /* 抵消父级.section的 padding-top，确保视频顶到可视区域顶部 */
  margin-top: -40px;
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

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

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

.section-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  height: 100%;
}

/* 强制突破父容器限制，确保视频背景完全铺满（对齐 AboutSection 实现） */
.contact-section {
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
  text-align: left;
  width: 100%;
  box-sizing: border-box;
}

.contact-info h3 {
  color: #FFC000;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.contact-info {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: flex-start;
  gap: 0;
  width: 100%;
  flex-wrap: nowrap;
}

.contact-item {
  display: flex;
  align-items: center;
  margin: 0;
  flex: 1 1 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-right: none;
  padding: 1.25rem 1.5rem;
  padding-bottom: 2.5rem;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.03);
  min-height: 100px;
}

.contact-item:last-child {
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.contact-item:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.contact-item:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.contact-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
  width: 40px;
  text-align: center;
}

.contact-details h4 {
  color: #FFC000;
  margin-bottom: 0.5rem;
}

.contact-details p {
  color: #ccc;
  margin: 0;
}

.external-link {
  color: #4fc3f7;
  text-decoration: none;
  border-bottom: 1px dashed rgba(79, 195, 247, 0.6);
  transition: color 0.2s ease, border-color 0.2s ease;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.external-link:hover {
  color: #FFD700;
  border-bottom-color: #FFD700;
}

.external-link::after {
  content: '↗';
  margin-left: 6px;
  font-size: 0.9em;
  opacity: 0.8;
}

/* removed form styles */

/* 响应式设计 */
@media (max-width: 768px) {
  .contact-section {
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
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 1rem;
  }
  
  .contact-item {
    border-right: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 12px;
    padding-bottom: 1.25rem;
    width: 100%;
  }
  
  .contact-item:first-child,
  .contact-item:last-child {
    border-radius: 12px;
  }
  
  /* 移动端增加遮罩层透明度，确保文字可读性 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
}

@media (max-width: 480px) {
  .contact-section {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    height: 100%;
  }
  
  .gradient-title {
    font-size: 1.8rem;
  }
  
  .section-content h2 {
    font-size: 1.8rem;
  }
  
  .contact-item {
    padding: 1rem;
    padding-bottom: 1.25rem;
  }
  
  .contact-icon {
    font-size: 1.3rem;
    margin-right: 0.8rem;
    width: 35px;
  }
  
  .contact-details h4 {
    font-size: 0.9rem;
  }
  
  .contact-details p {
    font-size: 0.85rem;
  }
  
  /* 小屏幕进一步增加遮罩层透明度 */
  .video-overlay {
    background: rgba(0, 0, 0, 0.6);
  }
}
</style>
