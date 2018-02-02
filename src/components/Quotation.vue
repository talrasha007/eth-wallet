<template>
  <div class="content">
    <div style="display: none;">{{quotations.cnt}}</div>
    <div class="quotation-panel" v-for="symbol in symbols" v-bind:key="symbol">
      <h4>{{symbol}}</h4>
      <table v-if="quotations[symbol]">
        <thead><tr>
          <th></th><th>卖</th><th>量</th><th>差</th><th>买</th><th>量</th><th>差</th>
        </tr></thead>
        <tbody>
          <tr v-if="!!quotations[symbol].usdt">
            <td>现货</td>
            <td>{{quotations[symbol].usdt.ask[0]}}</td>
            <td></td>
            <td></td>
            <td>{{quotations[symbol].usdt.bid[0]}}</td>
            <td></td>
            <td></td>
          </tr>

          <tr v-for="(cval, ctype) in ctypeMap" v-bind:key="ctype" v-if="!!quotations[symbol][ctype]">
            <td>{{cval}}</td>
            <td>{{quotations[symbol][ctype].ask[0]}}</td>
            <td>{{quotations[symbol][ctype].ask[1]}}</td>
            <td>
              {{quotations[symbol][ctype].closeDiffRate | rate}} |
              {{quotations[symbol][ctype].closeDiff | diff}}
            </td>
            <td>{{quotations[symbol][ctype].bid[0]}}</td>
            <td>{{quotations[symbol][ctype].bid[1]}}</td>
            <td>
              {{quotations[symbol][ctype].openDiffRate | rate}} |
              {{quotations[symbol][ctype].openDiff  | diff}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  const okEvtReg = /^ok_(.*)_(.*)_depth$/;
  const symbols = ['eos', 'bch', 'btc', 'eth', 'xrp', 'ltc', 'etc', 'btg'];
  const ctypeMap = {
    '0': '当周',
    '1': '次周',
    '3': '季度'
  };

  export default {
    name: 'quotation',

    beforeCreate() {
      this.ws = new WebSocket('ws://chain.v24.cn/depth');
      this.quotations = { cnt: 0 };
      this.ws.addEventListener('message', msg => {
        msg = JSON.parse(msg.data);

        const okEvent = okEvtReg.exec(msg.event);
        if (okEvent) {
          const [_, symbol, ctype] = okEvent;
          const quo = Object.assign({}, this.quotations[symbol]);
          const qc = quo[ctype] = { ask: msg.data.asks[4], bid: msg.data.bids[0] };
          qc.openDiff = quo.usdt && (qc.bid[0] - quo.usdt.ask[0]);
          qc.openDiffRate = quo.usdt && (qc.openDiff / quo.usdt.ask[0]);

          qc.closeDiff = quo.usdt && (qc.ask[0] - quo.usdt.bid[0]);
          qc.closeDiffRate = quo.usdt && (qc.closeDiff / quo.usdt.bid[0]);

          this.quotations[symbol] = quo;
        }

        this.quotations.cnt++;
      });
    },

    beforeDestroy() {
      this.ws.close();
    },

    data() {
      return {
        symbols,
        ctypeMap,
        quotations: this.quotations
      }
    },

    filters: {
      rate(v) {
        return v.toFixed && (v * 100).toFixed(2) + '%';
      },

      diff(v) {
        return v.toFixed && v.toFixed(2);
      }
    }
  }
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-end;

  .quotation-panel {
    margin: 50px;
    flex-grow: 1;

    table {
      text-align: center;
      min-width: 550px;
    }
  }
}
</style>
