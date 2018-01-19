<template>
  <div class="content">
    <div class="panel">
      <h1>账户</h1>
      <div class="balance-box">
        <icon name="money" class="icon" />
        <div class="balance">{{balance}}<span class="unit">ether</span></div>
        <div class="address">{{address}}</div>
      </div>
    </div>
    <div class="panel">
      <h1>历史</h1>
    </div>
  </div>
</template>

<script>
  import { account } from '@/lib/web3';

  export default {
    name: 'wallet',

    data() {
      return account;
    }
  }
</script>

<style scoped lang="scss">
  .panel {
    box-sizing: border-box;
    max-width: 50%;
    min-width: 400px;
    padding: 10px;
    float: left;

    .balance-box {
      padding: 10px;
      max-width: 400px;
      background: white;

      .icon {
        width: 32px;
        height: 46px;
        float: left;
        margin-right: 10px;
      }

      .balance {
        font-size: 1.3em;

        .unit {
          margin-left: 5px;
          font-size: 0.6em;
        }
      }

      .address {
        line-height: 1.4em;
        font-size: 0.8em;
      }
    }
  }
</style>