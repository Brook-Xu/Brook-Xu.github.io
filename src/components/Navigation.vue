<template>
  <nav>
    <!-- 左侧区域：Logo + 导航菜单 -->
    <div class="nav-left">
      <div class="nav-logo">
        <a href="/" @click.prevent="$router.push('/')" class="logo-link">
          <img v-if="logoUrl" :src="logoUrl" alt="STARNET DIGITAL" class="logo-image" />
          <div v-else class="logo-text">STARNET DIGITAL</div>
        </a>
      </div>
      <ul class="nav-menu" v-if="showNavigationMenu">
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'home' }">
          <a href="#home" @click.prevent="scrollToSection('home')" class="nav-link" :class="{ 'active': activeSection === 'home' }">{{ $t('navigation.home') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'about' }">
          <a href="#about" @click.prevent="scrollToSection('about')" class="nav-link" :class="{ 'active': activeSection === 'about' }">{{ $t('navigation.aboutUs') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'values' }">
          <a href="#values" @click.prevent="scrollToSection('values')" class="nav-link" :class="{ 'active': activeSection === 'values' }">{{ $t('navigation.coreValues') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'products' }">
          <a href="#products" @click.prevent="scrollToSection('products')" class="nav-link" :class="{ 'active': activeSection === 'products' }">{{ $t('navigation.products') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'risk' }">
          <a href="#risk" @click.prevent="scrollToSection('risk')" class="nav-link" :class="{ 'active': activeSection === 'risk' }">{{ $t('navigation.riskManagement') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'partners' }">
          <a href="#partners" @click.prevent="scrollToSection('partners')" class="nav-link" :class="{ 'active': activeSection === 'partners' }">{{ $t('navigation.partners') }}</a>
        </li>
        <li class="menu-item" :class="{ 'current-menu-item': activeSection === 'contact' }">
          <a href="#contact" @click.prevent="scrollToSection('contact')" class="nav-link" :class="{ 'active': activeSection === 'contact' }">{{ $t('navigation.contactUs') }}</a>
        </li>
      </ul>
    </div>
    
    <!-- 右侧按钮区域 -->
    <div class="nav-actions">
      <button class="action-btn login-btn" @click="handleLogin">
        <i class="icon-user"></i>
        {{ $t('navigation.login') }}
      </button>
      <div class="language-dropdown" :class="{ 'dropdown-open': showLanguageDropdown }">
        <button class="action-btn language-btn" @click="toggleLanguageDropdown">
          <i class="icon-globe"></i>
          {{ currentLanguageDisplay }}
        </button>
        <transition name="dropdown" appear>
          <div class="language-dropdown-menu" v-show="showLanguageDropdown">
          <div 
            class="language-option" 
            :class="{ 'active': currentLanguage === 'en' }"
            @click="selectLanguage('en')"
          >
            <span class="flag">🇺🇸</span>
            <span class="language-name">English</span>
          </div>
          <div 
            class="language-option" 
            :class="{ 'active': currentLanguage === 'zh' }"
            @click="selectLanguage('zh')"
          >
            <span class="flag">🇨🇳</span>
            <span class="language-name">中文</span>
          </div>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script>
import logoImage from '../assets/starnet-logo.png';
import { setLanguage, getCurrentLanguage, getAvailableLanguages } from '../i18n';

export default {
  name: 'Navigation',
  data() {
    return {
      logoUrl: logoImage,
      showLanguageDropdown: false,
      currentLanguage: getCurrentLanguage(),
      activeSection: 'home'
    };
  },
  mounted() {
    // 监听来自Home组件的section变化事件
    this.$parent.$on('section-change', this.updateActiveSection);
  },
  beforeDestroy() {
    // 清理事件监听
    this.$parent.$off('section-change', this.updateActiveSection);
  },
  computed: {
    currentLanguageDisplay() {
      const languages = getAvailableLanguages();
      const lang = languages.find(l => l.code === this.currentLanguage);
      return lang ? lang.nativeName : 'EN';
    },
    showNavigationMenu() {
      // 在/charts路由时不显示导航菜单，在首页且屏幕宽度足够时显示
      return this.$route.path === '/' && window.innerWidth > 1450;
    }
  },
  mounted() {
    // 监听点击事件，点击外部时关闭下拉框
    document.addEventListener('click', this.handleClickOutside);
    // 监听窗口大小变化
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    // 清理事件监听器
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // 滚动到指定section
    scrollToSection(anchor) {
      // 通过事件总线通知Home组件滚动到指定section
      this.$emit('scroll-to-section', anchor);
    },

    // 更新活动section状态
    updateActiveSection(anchor) {
      this.activeSection = anchor;
    },

    handleLogin() {
      // TODO: 实现登录功能
      console.log('Login button clicked');
    },
    toggleLanguageDropdown() {
      this.showLanguageDropdown = !this.showLanguageDropdown;
    },
    selectLanguage(langCode) {
      if (this.currentLanguage !== langCode) {
        this.currentLanguage = langCode;
        setLanguage(langCode);
        
        // 如果在首页，平滑滚动到顶部（不刷新页面）
        if (this.$route.path === '/') {
          // 滚动到页面顶部
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          // 非首页刷新页面以应用语言更改
          window.location.reload();
        }
      }
      this.showLanguageDropdown = false;
    },
    handleClickOutside(event) {
      // 如果点击的不是语言下拉框区域，则关闭下拉框
      if (!this.$el.contains(event.target)) {
        this.showLanguageDropdown = false;
      }
    },
    handleResize() {
      // 强制重新计算计算属性
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%);
  padding: 0.75rem 1rem;
  min-height: 50px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 40px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

.logo-text {
  color: #FFC000;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.logo-text:hover {
  color: #FFD700;
}

.nav-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item {
  margin: 0;
  padding: 0;
}


.nav-link {
  color: #eee;
  margin: 0 0.3rem;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  display: block;
  font-size: 18px;
  font-weight: 500;
}

.nav-link:hover {
  color: #FFC000;
}

.nav-link.active {
  color: #FFC000;
}

/* 右侧按钮区域样式 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  border: 1px solid #FFC000;
  background: transparent;
  color: #FFC000;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Montserrat', 'Arial', sans-serif;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  min-width: 100px;
  justify-content: center;
}

.action-btn:hover {
  background: #FFC000;
  color: #222222;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 192, 0, 0.3);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(255, 192, 0, 0.3);
}

.login-btn {
  border-color: #FFC000;
  color: #FFC000;
}

.login-btn:hover {
  background: #FFC000;
  color: #222222;
}

.login-btn:hover .icon-user::before {
  color: #222222;
}

.language-btn {
  border-color: #FFC000;
  color: #FFC000;
}

.language-btn:hover {
  background: #FFC000;
  color: #222222;
  border-color: #FFC000;
}

/* 图标样式 */
.action-btn i {
  font-style: normal;
  font-size: 16px;
}

.icon-user::before {
  content: "👤";
  color: #00d4ff;
  font-size: 18px;
}

.icon-globe::before {
  content: "🌐";
  color: #FFC000;
  font-size: 18px;
}

/* 语言下拉框样式 */
.language-dropdown {
  position: relative;
  display: inline-block;
}

.language-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 100%;
  margin-top: 2px;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #444;
  transform: translateX(-10px);
  opacity: 0;
  animation: slideInFromLeft 0.15s ease forwards;
}

.language-option:nth-child(1) {
  animation-delay: 0.05s;
}

.language-option:nth-child(2) {
  animation-delay: 0.1s;
}

@keyframes slideInFromLeft {
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Vue过渡动画 */
.dropdown-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.language-option:last-child {
  border-bottom: none;
}

.language-option:hover {
  background: #444;
}

.language-option.active {
  background: #FFC000;
  color: #222;
}

.language-option.active:hover {
  background: #FFD700;
}

.flag {
  font-size: 18px;
  margin-right: 8px;
  width: 20px;
  text-align: center;
}

.language-name {
  font-size: 14px;
  font-weight: 500;
}


/* 响应式设计 */
@media (max-width: 1450px) {
  nav {
    flex-direction: row;
    padding: 0.75rem 1rem;
    gap: 0;
    min-height: 50px;
    justify-content: space-between;
  }
  
  .nav-left {
    flex-direction: row;
    gap: 0;
    width: auto;
  }
  
  .nav-logo {
    margin-bottom: 0;
  }
  
  /* 隐藏导航菜单 */
  .nav-menu {
    display: none;
  }
  
  .nav-actions {
    justify-content: flex-end;
    margin-top: 0;
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.4rem 0.8rem;
    font-size: 14px;
    min-width: 80px;
  }
  
  .language-dropdown-menu {
    right: 0;
    left: auto;
    transform: none;
    width: 120px;
  }
}

/* 更小屏幕的优化 */
@media (max-width: 1050px) {
  nav {
    padding: 0.5rem 0.75rem;
  }
  
  .action-btn {
    padding: 0.3rem 0.6rem;
    font-size: 13px;
    min-width: 70px;
  }
  
  .logo-image {
    height: 35px;
  }
  
  .logo-text {
    font-size: 18px;
  }
}
</style>
