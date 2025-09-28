<template>
  <div id="app">
    <nav>
      <a href="/" @click.prevent="$router.push('/')">Home</a>
      <a href="/upload" @click.prevent="$router.push('/upload')">Upload</a>
      <a href="/charts" @click.prevent="$router.push('/charts')">Charts</a>
    </nav>
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background: #111;
  color: #eee;
}
nav {
  display: flex;
  justify-content: center;
  background: #222;
  padding: 1rem;
}
nav a {
  color: #eee;
  margin: 0 1rem;
  text-decoration: none;
  transition: color 0.3s;
}
nav a:hover {
  color: #42b983;
}
</style>
