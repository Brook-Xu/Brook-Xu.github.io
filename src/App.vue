<template>
  <div id="app">
    <nav>
      <div class="nav-logo">
        <a href="/" @click.prevent="$router.push('/')" class="logo-link">
          <img v-if="logoUrl" :src="logoUrl" alt="STARNET DIGITAL" class="logo-image" />
          <div v-else class="logo-text">STARNET DIGITAL</div>
        </a>
      </div>
      <ul class="nav-menu">
        <li class="menu-item current-menu-item">
          <a href="/" @click.prevent="$router.push('/')" class="nav-link active">Home</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#about" class="nav-link">About us</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#values" class="nav-link">Our core values</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#products" class="nav-link">Our products</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#risk" class="nav-link">Risk Management</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#partners" class="nav-link">Partners</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#contact" class="nav-link">Contact us</a>
        </li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
import logoImage from './assets/starnet-logo.png';

export default {
  name: 'App',
  data() {
    return {
      logoUrl: logoImage
    };
  }
};
</script>

<style>
body {
  margin: 0;
  font-family: 'Montserrat', 'Arial', sans-serif;
  background: #153252;
  color: #eee;
}
nav {
  display: flex;
  align-items: center;
  background: #222222;
  padding: 1rem;
  min-height: 60px;
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
  color: #42b983;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}
.logo-text:hover {
  color: #66d9a3;
}
.nav-menu {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: flex-start;
}
.menu-item {
  margin: 0;
  padding: 0;
}
.menu-separator {
  color: #666;
  margin: 0 0.2rem;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
}
.nav-link {
  color: #eee;
  margin: 0 0.3rem;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  display: block;
  font-size: 16px;
  font-weight: 500;
}
.nav-link:hover {
  color: #C35342;
  background-color: rgba(195, 83, 66, 0.1);
}
.nav-link.active {
  color: #C35342;
  background-color: rgba(195, 83, 66, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    padding: 0.5rem;
    gap: 1rem;
  }
  .nav-logo {
    margin-bottom: 0;
  }
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  .nav-link {
    margin: 0.15rem;
    padding: 0.3rem 0.5rem;
    font-size: 14px;
  }
  .menu-separator {
    margin: 0 0.15rem;
    font-size: 12px;
  }
}
</style>
