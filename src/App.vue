<template>
  <div id="app">
    <ul class="header">
      <li v-for="item in navItems" v-bind:key="item.href" v-bind:class="{ active: '#' + $route.path === item.href }">
        <a v-bind:href="item.href">
          <icon v-bind:name="item.icon" class="icon" />{{item.name}}
        </a>
      </li>
      <li class="placeholder"></li>
      <li class="network">
        <icon name="server" class="icon" />{{network.blockNumber}}&nbsp;&nbsp;
        <icon name="clock-o" class="icon" />{{network.lastBlockTsFromNow}}
      </li>
    </ul>
    <router-view />
  </div>
</template>

<script>
  import { network } from "./lib/web3";

  export default {
    name: 'app',

    data() {
      return {
        network,
        navItems: [
          { href: '#/wallet', icon: 'credit-card', name: '钱包' },
          { href: '#/ttl', icon: 'gg', name: 'TTL' },
          { href: '#/quotation', icon: 'line-chart', name: '行情' }
        ]
      };
    }
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

    > li.placeholder {
      flex-grow: 1;
      padding: 0;
      margin: 0;
    }

    > li.network {
      padding-right: 0;
      line-height: 0.9em;
      font-size: 0.9em;
      display: flex;
      align-items: safe;

      .icon {
        height: 10px;
      }
    }
  }
</style>
