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
            <div class="line">
              <span 
                v-for="(word, index) in englishLine1" 
                :key="'en1-' + index"
                class="word" 
                :class="{ 'animate-word': showTextAnimation }"
                :style="{ 'transition-delay': (index * 0.3) + 's' }"
              >{{ word }}</span>
            </div>
            <div class="line">
              <span 
                v-for="(word, index) in englishLine2" 
                :key="'en2-' + index"
                class="word" 
                :class="{ 'animate-word': showTextAnimation }"
                :style="{ 'transition-delay': (englishLine1.length * 0.3 + index * 0.3) + 's' }"
              >{{ word }}</span>
            </div>
          </template>
          <template v-else>
            <div class="line">
              <span 
                v-for="(word, index) in chineseLine1" 
                :key="'zh1-' + index"
                class="word" 
                :class="{ 'animate-word': showTextAnimation }"
                :style="{ 'transition-delay': (index * 0.4) + 's' }"
              >{{ word }}</span>
            </div>
            <div class="line">
              <span 
                v-for="(word, index) in chineseLine2" 
                :key="'zh2-' + index"
                class="word" 
                :class="{ 'animate-word': showTextAnimation }"
                :style="{ 'transition-delay': (chineseLine1.length * 0.4 + index * 0.4) + 's' }"
              >{{ word }}</span>
            </div>
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
      showTextAnimation: false,
      englishLine1: ['Unleash', 'your', 'growth'],
      englishLine2: ['with', 'diverse', 'strategies'],
      chineseLine1: ['释放', '您的', '增长', '潜力'],
      chineseLine2: ['多元化', '策略', '驱动']
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
      // 延迟启动以等待布局稳定，增加延迟时间让动画更慢
      setTimeout(() => {
        this.showTextAnimation = true;
      }, 800);
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
  color: #FFC000;
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
  color: #ffffff;
  font-weight: 700;
  font-style: italic;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
  font-size: 4rem; /* 统一字体大小，适用于所有语言 */
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
}

.hero-title .line {
  display: block;
  font-size: inherit; /* 继承父元素字体大小 */
  margin-bottom: 0.5rem; /* 两行之间的间距 */
}

.hero-title .word {
  display: inline-block;
  margin-right: 0.3em; /* 单词之间的间距 */
  opacity: 0;
  transform: translateX(-30px);
  filter: blur(8px);
  transition: transform 1.2s ease-out, opacity 1.2s ease-out, filter 1.2s ease-out;
}

.hero-title .word.animate-word {
  opacity: 1;
  transform: translateX(0);
  filter: blur(0px);
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
