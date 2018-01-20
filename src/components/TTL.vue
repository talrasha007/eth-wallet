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
    <table>
      <thead>
        <tr><th>Owner</th><th>数量</th><th>创建时间</th><th>已取出</th><th>收益</th><th>修改时间</th></tr>
      </thead>
      <tr v-for="ticket of ttl.tickets">
        <td>{{ticket.owner}}</td>
        <td>{{ticket.amount}}</td>
        <td>{{ticket.ts | moment('YYYYMMDD HH:mm')}}</td>
        <td>{{ticket.withdraw}}</td>
        <td>{{ticket.profit}}</td>
        <td>{{ticket.lastModified | moment('YYYYMMDD HH:mm')}}</td>
      </tr>
    </table>
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
      const tx = await instance.sendProfit(profit, Date.now() / 1000);
      console.log(tx);
    },

    async update() {
      const totalTickets = await instance.totalSupply();
      if (account.address) {
        Object.assign(ttl, {
          isAdmin: account.address === await instance.admin(),
          tickets: await ttl.getTickets(Array(totalTickets.toNumber()).fill().map((_, i) => i)),
          myTickets: await ttl.getTickets(await instance.tokensOfOwner(account.address))
        });
      }
    },

    async getTickets(arr) {
      const rawTickets = await Promise.all(arr.map(id => instance.tickets(id)));
      const tickets = rawTickets.map((ticket, idx) => {
        const [amount, ts, lastModified, withdraw, profit] = ticket.map(v => v.toNumber());
        return { id: arr[idx], amount, ts, lastModified, withdraw, profit };
      });

      for (const ticket of tickets) {
        console.log(ticket);
        ticket.owner = await instance.ownerOf(ticket.id);
      }

      return tickets;
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