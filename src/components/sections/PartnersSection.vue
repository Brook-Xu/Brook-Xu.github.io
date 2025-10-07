<template>
  <div class="section-content">
    <h2 class="gradient-title">{{ $t('navigation.partners') }}</h2>
    <div class="partners-content">
      <div class="logo-ticker" aria-label="合作伙伴" tabindex="0">
        <div class="track">
          <div class="partner-item" v-for="(partner, index) in partners" :key="index">
            <img :src="partner.logo" :alt="partner.name" class="partner-logo" />
          </div>
          <div class="partner-item" v-for="(partner, index) in partners" :key="'copy-' + index" aria-hidden="true">
            <img :src="partner.logo" alt="" class="partner-logo" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入图片
import attLogo from '../../assets/AT&T-Logo.wine.png';
import deShawLogo from '../../assets/d-e-shaw-co-logo-png_seeklogo-508288.png';
import microsoftLogo from '../../assets/MS_Standard_Logo_2022_Black.svg';
import cuBlueLogo from '../../assets/cu-blue-logo.svg';
import goldBlueLogo from '../../assets/logo-variations-thumbnail-gold-blue-1.png';
import imageLogo from '../../assets/image.svg';

export default {
  name: 'PartnersSection',
  data() {
    return {
      partners: [
        {
          name: 'AT&T',
          logo: attLogo
        },
        {
          name: 'D.E. Shaw',
          logo: deShawLogo
        },
        {
          name: 'Microsoft',
          logo: microsoftLogo
        },
        {
          name: 'CU Blue',
          logo: cuBlueLogo
        },
        {
          name: 'Gold Blue',
          logo: goldBlueLogo
        },
        {
          name: 'Image',
          logo: imageLogo
        },
        {
          name: 'AT&T',
          logo: attLogo
        },
        {
          name: 'D.E. Shaw',
          logo: deShawLogo
        },
        {
          name: 'Microsoft',
          logo: microsoftLogo
        },
        {
          name: 'CU Blue',
          logo: cuBlueLogo
        },
        {
          name: 'Gold Blue',
          logo: goldBlueLogo
        },
        {
          name: 'Image',
          logo: imageLogo
        },
        {
          name: 'AT&T',
          logo: attLogo
        },
        {
          name: 'D.E. Shaw',
          logo: deShawLogo
        },
        {
          name: 'Microsoft',
          logo: microsoftLogo
        },
        {
          name: 'CU Blue',
          logo: cuBlueLogo
        },
        {
          name: 'Gold Blue',
          logo: goldBlueLogo
        },
        {
          name: 'Image',
          logo: imageLogo
        },
      ]
    };
  },
  mounted() {
    this.computeMoveDistance();
    window.addEventListener('resize', this.computeMoveDistance);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.computeMoveDistance);
  },
  methods: {
    computeMoveDistance() {
      this.$nextTick(() => {
        const track = this.$el && this.$el.querySelector ? this.$el.querySelector('.track') : null;
        if (!track) return;
        // 两组内容完全相同，位移距离等于总内容宽度的一半
        const halfWidthPx = track.scrollWidth / 2;
        track.style.setProperty('--move-distance', `-${halfWidthPx}px`);
      });
    }
  }
};
</script>

<style scoped>
.section-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

/* 渐变色标题 */
.gradient-title {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #42b983, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.section-content h2 {
  font-size: 2.5rem;
  background: linear-gradient(90deg, #42b983, #4fc3f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.logo-ticker {
  overflow: hidden;
  width: 100%;
  --height: 240px;
  margin-top: 2rem;
}

.logo-ticker .track {
  display: flex;
  gap: 4.2rem;
  align-items: center;
  height: var(--height);
  /* duration 控制滚动速度（越小越快），可根据需要调整 */
  --duration: 20s;
  /* 默认值，mounted 后会用 JS 覆盖为像素值 */
  --move-distance: -50%;
  /* 提前重置比例（< 1 会略早重置，避免边界闪白），可按需微调 */
  --reset-ratio: 0.67;
  animation: scroll-left var(--duration) linear infinite;
  will-change: transform;
}

.logo-ticker .partner-item {
  flex: 0 0 auto;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(66, 185, 131, 0.3);
  transition: all 0.3s ease;
  width: 320px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

.logo-ticker .partner-item:hover {
  border-color: #42b983;
  box-shadow: 0 10px 30px rgba(66, 185, 131, 0.2);
}

.logo-ticker .partner-logo {
  width: 240px;
  height: 180px;
  display: block;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px;
}

/* 悬停或获得键盘焦点时暂停 */
.logo-ticker:hover .track,
.logo-ticker:focus-within .track {
  animation-play-state: paused;
}

/* 无障碍：用户偏好减少动画时关闭 */
@media (prefers-reduced-motion: reduce) {
  .logo-ticker .track {
    animation: none;
  }
}

/* 动画：按 "--move-distance" 进行绝对像素位移（两组内容宽度的一半） */
@keyframes scroll-left {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(calc(var(--move-distance) * var(--reset-ratio)), 0, 0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gradient-title {
    font-size: 2rem;
  }
  
  .section-content h2 {
    font-size: 2rem;
  }
  
  .logo-ticker .track {
    gap: 3.3rem;
  }
  
  .logo-ticker .partner-item {
    padding: 0.8rem;
    width: 150px;
    height: 80px;
  }
  
  .logo-ticker .partner-logo {
    width: 120px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .logo-ticker .track {
    gap: 2.5rem;
  }
  
  .logo-ticker .partner-item {
    padding: 0.6rem;
    width: 120px;
    height: 70px;
  }
  
  .logo-ticker .partner-logo {
    width: 100px;
    height: 50px;
  }
}
</style>
