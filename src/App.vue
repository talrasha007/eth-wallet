<template>
  <div id="app">
    <ul class="header">
      <li v-bind:class="{ active: $route.path === '/wallet' }"><a href="#/wallet"><icon name="credit-card" class="icon" />钱包</a></li>
      <li v-bind:class="{ active: $route.path === '/token' }"><a href="#/token"><icon name="gg" class="icon" />代币</a></li>
    </ul>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  background-color: #fafafa;
  color: #827a7a;
}

.clearfix::after {
  content: "";
  clear: both;
  display: table;
}

.content {
  margin: 10px 80px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped lang="scss">
  ul.header {
    padding: 17px 80px 0 80px;
    background: #f0f0f0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    align-items: flex-end;

    > li {
      text-align: center;
      padding: 0 30px;
      border-bottom: 5px solid #f0f0f0;

      a:hover {
        cursor: pointer;
      }

      a {
        text-decoration: none;
        color: #0285c0;

        .icon {
          width: 32px;
          height: 32px;
          display: block;
        }
      }
    }

    > li.active {
      border-bottom: 5px solid white;

      a {
        color: #b7a6a6;
      }
    }
  }
</style>