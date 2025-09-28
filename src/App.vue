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
          <a href="#1" class="nav-link">About us</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#2" class="nav-link">Digital Management Solution</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#3" class="nav-link">Crypto Hedge Fund Management</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#5" class="nav-link">News Engagement</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#6" class="nav-link">Career Development</a>
        </li>
        <li class="menu-separator">|</li>
        <li class="menu-item">
          <a href="#7" class="nav-link">Contact us</a>
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
  font-family: 'Arial', sans-serif;
  background: #153252;
  color: #eee;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #222222;
  padding: 1rem;
  min-height: 60px;
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
  justify-content: flex-end;
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
  }
  .nav-logo {
    margin-bottom: 1rem;
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
