<template>
  <div class="content">
    <form action="javascript:void(0)" v-if="ttl.isAdmin">
      <div class="form-group">
        <select v-model="contract.type" title="操作">
          <option value="create" selected>存入</option>
          <option value="withdraw">取出</option>
          <option value="sendProfit">收益</option>
        </select>
        <input v-model="contract.address" v-if="contract.type !== 'sendProfit'" type="text" placeholder="地址" size="50" />
        <input v-model="contract.amount" type="number" placeholder="数量" />
        <button v-on:click="ttl[contract.type](contract.address, contract.amount * Math.pow(10, ttl.decimals))">提交</button>
      </div>
    </form>
    <div class="tickets-container">
      <div>
        <h4>我的票据</h4>
        <ul class="ticket-box">
          <li v-for="ticket of ttl.myTickets">
            <div class="balance">${{ticket.amount | amount}}<span>{{ticket.ts | moment('YYYY-MM-DD HH:mm')}}</span></div>
            <div class="desc">{{ticket.lastModified | moment('YYYY-MM-DD HH:mm')}} 总收益:{{ticket.profit | amount}} 总取出:{{ticket.withdraw | amount}}</div>
          </li>
        </ul>
      </div>
      <div>
        <h4>所有票据</h4>
        <ul class="ticket-box">
          <li v-for="ticket of ttl.tickets">
            <div class="balance">${{ticket.amount | amount}}<span>{{ticket.ts | moment('YYYY-MM-DD HH:mm')}}</span></div>
            <div class="desc">{{ticket.owner}}</div>
            <div class="desc">{{ticket.lastModified | moment('YYYY-MM-DD HH:mm')}} 总收益:${{ticket.profit | amount}} 总取出:${{ticket.withdraw | amount}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import { account, event } from '@/lib/web3';
  import { loadTtl } from '@/lib/contracts';

  const instance = loadTtl('0x8c92684a6d5705f8366597e68c708008c0a5cdec');
  const ttl = {
    async create(address, amount) {
      const tx = await instance.createTicket(address, amount);
      console.log(tx);
    },

    async withdraw(address, amount) {
      const tx = await instance.withdraw(address, amount);
      console.log(tx);
    },

    async sendProfit(_, profit) {
      const tx = await instance.sendProfit(profit, Date.now() / 1000);
      console.log(tx);
    },

    async update() {
      const totalTickets = await instance.totalSupply();
      if (account.address) {
        Object.assign(ttl, {
          isAdmin: account.address === await instance.admin(),
          decimals: await instance.decimals(),
          tickets: await ttl.getTickets(Array(totalTickets.toNumber()).fill().map((_, i) => i)),
          myTickets: await ttl.getTickets(await instance.tokensOfOwner(account.address))
        });
      }
    },

    async getTickets(arr) {
      const rawTickets = await Promise.all(arr.reverse().map(id => instance.tickets(id)));
      const tickets = rawTickets.map((ticket, idx) => {
        const [amount, ts, lastModified, withdraw, profit] = ticket.map(v => v.toNumber());
        return { id: arr[idx], amount, ts, lastModified, withdraw, profit };
      });

      for (const ticket of tickets) {
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

    filters: {
      amount (value) {
        return value / Math.pow(10, ttl.decimals);
      }
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

  .tickets-container {
    display: flex;
    flex-flow: row wrap;

    > div {
      flex-grow: 1;

      ul.ticket-box {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 400px;

        > li {
          display: flex;
          flex-flow: column;
          padding: 10px;
          margin: 10px;
          background-color: white;

          .balance {
            font-size: 1.4em;
            span {
              margin-left: 10px;
              font-size: 0.7em;
            }
          }

          .desc {
            font-size: 0.7em;
          }
        }
      }
    }
  }
</style>