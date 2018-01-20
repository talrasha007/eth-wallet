<template>
  <div class="content">
    <div>
      <h1>账户</h1>
      <div class="balance-box">
        <icon name="money" class="icon" />
        <div>
          <div class="balance">{{balance}}<span class="unit">ether</span></div>
          <div class="address">{{address || 'loading...'}}</div>
        </div>
      </div>
    </div>
    <div class="history">
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
  .content {
    .balance-box {
      margin: 10px;
      padding: 10px;
      width: 350px;
      background: white;
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      .icon {
        flex-basis: 32px;
        height: 32px;
        margin-right: 10px;
      }

      .balance {
        line-height: 1.4em;
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