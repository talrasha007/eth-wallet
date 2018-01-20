<template>
  <div class="content">
    <form action="javascript:void(0)" v-if="ttl.isAdmin">
      <div class="form-group">
        <select v-model="contract.type">
          <option value="create" selected>存入</option>
          <option value="withdraw">取出</option>
          <option value="sendProfit">收益</option>
        </select>
        <input v-model="contract.address" v-if="contract.type !== 'sendProfit'" type="text" placeholder="地址" size="50" />
        <input v-model="contract.amount" type="number" placeholder="数量" />
        <button v-on:click="ttl[contract.type](contract.address, contract.amount)">提交</button>
      </div>
    </form>
  </div>
</template>

<script>
  import { account, event } from '@/lib/web3';
  import { loadTtl } from '@/lib/contracts';

  const instance = loadTtl('0x78e481d8ee6a6dfe9bc2886880b18b030a45f89d');
  const ttl = {
    reset() {
      Object.assign(ttl, {
        isAdmin: false,
        tickets: [],
        myTickets: []
      });
    },

    async create(address, amount) {
      const tx = await instance.createTicket(address, amount);
      console.log(tx);
    },

    async withdraw(address, amount) {
      const tx = await instance.withdraw(address, amount);
      console.log(tx);
    },

    async sendProfit(profit) {
      const tx = await instance.sendProfit(profit, Date.now() / 1000 - 3600 * 24);
      console.log(tx);
    },

    async update() {
      if (account.address) {
        Object.assign(ttl, {
          isAdmin: account.address === await instance.admin()
        });
      }
    },

    isAdmin: false,
    tickets: [],
    myTickets: []
  };

  export default {
    name: 'ttl',

    async beforeCreate() {
      ttl.update();
      event.$on('account_changed', ttl.update);
    },

    async destroyed() {
      event.$off('account_changed', ttl.update);
    },

    data() {
      return {
        ttl,
        contract: { type: 'create', address: '',  amount: null }
      };
    }
  }
</script>

<style scoped lang="scss">
  form {
    margin-top: 20px;
    .form-group {
      display: flex;
      flex-flow: row wrap;
      align-items: center;

      label {
        margin-right: 20px;
      }

      select {
        height: 35px;
      }

      input {
        padding: 10px;
        margin: 10px;
      }

      button {
        color: white;
        padding: 10px;
        background-color: #02a8f3;
      }
    }
  }
</style>