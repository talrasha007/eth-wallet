<template>
  <div class="content" v-if="!metamaskInstalled">
    <h1>根据我多年的经验，你木有安装MetaMask？</h1>
    <a href="https://metamask.io" target="_blank">
      <img src="../assets/download-metamask.png" />
    </a>
  </div>
  <div class="content" v-else-if="locked">
    <h1>快去解锁你的MetaMask吧</h1>
  </div>
  <div class="content" v-else>
    <h1>我是谁？我为什么会在这里？</h1>
  </div>
</template>

<script>
  export default {
    name: "error",
    data: () => ({
      metamaskInstalled: !!window.web3,
      locked: window.web3.eth.accounts.length === 0
    })
  }
</script>

<style scoped>

</style>