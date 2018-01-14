<template>
  <div id="app">
    <ul class="header clearfix">
      <li v-bind:class="{ active: $route.path === '/' }"><a href="#/"><icon name="credit-card" class="icon" /></a>钱包</li>
      <li v-bind:class="{ active: $route.path === '/token' }"><a href="#/token"><icon name="gg" class="icon" /></a>代币</li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
ul.header {
  padding: 17px 80px 0 80px;
  background: #f0f0f0;
  margin: 0;
  list-style: none;
}

ul.header li {
  color: #0285c0;
  text-align: center;
  padding: 0 30px;
  float: left;
  border-bottom: 5px solid #f0f0f0;
}

ul.header li a {
  color: inherit;
}

ul.header li a:hover {
  cursor: pointer;
}

ul.header li.active {
  color: #b7a6a6;
  border-bottom: 5px solid white;
}

ul.header li .icon {
  width: 32px;
  height: 32px;
  display: block;
}
</style>