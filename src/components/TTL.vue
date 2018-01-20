<template>
  <div class="content">
    <form action="javascript:void(0)" v-if="ttl.isAdmin">
      <div class="form-group">
        <select>
          <option selected>存入</option>
          <option>取出</option>
        </select>
        <input type="text" placeholder="地址" size="50" />
        <input type="number" placeholder="数量" />
        <button>提交</button>
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
      return { ttl };
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