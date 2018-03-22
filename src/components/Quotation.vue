<template>
  <div class="content">
    <div style="display: none;">{{quotations.cnt}}</div>
    <div class="quotation-panel" v-for="symbol in symbols" :key="symbol">
      <h4>{{symbol}}</h4>
      <table v-if="quotations[symbol]">
        <thead><tr>
          <th></th><th>卖</th><th width="30px" class="hide-mobile">量</th><th>差</th><th>买</th><th width="30px" class="hide-mobile">量</th><th>差</th>
        </tr></thead>
        <tbody>
          <tr v-if="!!quotations[symbol].bn">
            <td>币安</td>
            <td :class="quotations[symbol].bn | closeClass">{{quotations[symbol].bn.ask[0] | price}}</td>
            <td class="hide-mobile"></td>
            <td :class="quotations[symbol].bn | closeClass">
              {{quotations[symbol].bn.closeDiffRate | rate}}
              <span class="hide-mobile">| {{quotations[symbol].bn.closeDiff | diff}}</span>
            </td>
            <td :class="quotations[symbol].bn | openClass">{{quotations[symbol].bn.bid[0] | price}}</td>
            <td class="hide-mobile"></td>
            <td :class="quotations[symbol].bn | openClass">
              {{quotations[symbol].bn.openDiffRate | rate}}
              <span class="hide-mobile">| {{quotations[symbol].bn.openDiff  | diff}}</span>
            </td>
          </tr>

          <tr v-if="!!quotations[symbol].usdt">
            <td>现货</td>
            <td>{{quotations[symbol].usdt.ask[0] | price}}</td>
            <td class="hide-mobile"></td>
            <td></td>
            <td>{{quotations[symbol].usdt.bid[0] | price}}</td>
            <td class="hide-mobile"></td>
            <td></td>
          </tr>

          <tr v-for="(cval, ctype) in ctypeMap" :key="ctype" v-if="!!quotations[symbol][ctype]">
            <td>{{cval}}</td>
            <td :class="quotations[symbol][ctype] | closeClass">{{quotations[symbol][ctype].ask[0] | price}}</td>
            <td class="hide-mobile">{{quotations[symbol][ctype].ask[1]}}</td>
            <td :class="quotations[symbol][ctype] | closeClass">
              {{quotations[symbol][ctype].closeDiffRate | rate}}
              <span class="hide-mobile">| {{quotations[symbol][ctype].closeDiff | diff}}</span>
            </td>
            <td :class="quotations[symbol][ctype] | openClass">{{quotations[symbol][ctype].bid[0] | price}}</td>
            <td class="hide-mobile">{{quotations[symbol][ctype].bid[1]}}</td>
            <td :class="quotations[symbol][ctype] | openClass">
              {{quotations[symbol][ctype].openDiffRate | rate}}
              <span class="hide-mobile">| {{quotations[symbol][ctype].openDiff  | diff}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  const okEvtReg = /^ok_(.*)_(.*)_depth$/;
  const bnEvtReg = /^BN_(.*)USDT_DEPTH$/;
  const symbols = ['eos', 'bch', 'btc', 'eth', 'xrp', 'ltc', 'etc', 'btg'];
  const ctypeMap = {
    '0': '当周',
    '1': '次周',
    '2': '季度'
  };

  function updateDiff(quo) {
    [0, 1, 2, 'bn'].forEach(k => {
      quo[k] && computeDiff(quo, quo[k]);
    });
  }

  function computeDiff(quo, qc) {
    qc.openDiff = quo.usdt && (qc.bid[0] - quo.usdt.ask[0]);
    qc.openDiffRate = quo.usdt && (qc.openDiff / quo.usdt.ask[0]);

    qc.closeDiff = quo.usdt && (qc.ask[0] - quo.usdt.bid[0]);
    qc.closeDiffRate = quo.usdt && (qc.closeDiff / quo.usdt.bid[0]);

    return quo;
  }

  export default {
    name: 'quotation',

    beforeCreate() {
      this.ws = new WebSocket('ws://i43.io/depth');
      this.quotations = { cnt: 0 };
      this.ws.addEventListener('message', msg => {
        msg = JSON.parse(msg.data);

        const okEvent = okEvtReg.exec(msg.event);
        if (okEvent) {
          const [_, symbol, ctype] = okEvent;
          const quo = Object.assign({}, this.quotations[symbol]);
          const qc = quo[ctype] = { ask: msg.data.asks[4], bid: msg.data.bids[0] };

          if (ctype === 'usdt') {
            this.quotations[symbol] = quo;
            updateDiff(quo);
          } else {
            this.quotations[symbol] = computeDiff(quo, qc);
          }
        }

        const bnEvent = bnEvtReg.exec(msg.event);
        if (bnEvent) {
          const symbol = bnEvent[1].toLowerCase();

          const quo = Object.assign({}, this.quotations[symbol]);
          const qc = quo.bn = { ask: msg.data.asks[0], bid: msg.data.bids[4] };

          this.quotations[symbol] = computeDiff(quo, qc);
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
        return v && v.toFixed && (v * 100).toFixed(2) + '%';
      },

      diff(v) {
        return v && v.toFixed && v.toFixed(2);
      },

      price(v) {
        const decimals = v > 10 ? 2 : 4;
        return v && (v * 1).toFixed(decimals);
      },

      openClass(qc) {
        return { red: qc.openDiff < 0, green: qc.openDiff > 0 };
      },

      closeClass(qc) {
        return { red: qc.closeDiff < 0, green: qc.closeDiff > 0 };
      }
    }
  }
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;

  .quotation-panel {
    flex-grow: 1;
    @media only screen and (min-width:640px) {
      margin: 25px;
    }

    table {
      font-family: monospace;
      text-align: center;
      min-width: 100%;
      @media only screen and (min-width:640px) {
        min-width: 500px;
      }

      .green {
        color: green;
      }

      .red {
        color: red;
      }
    }
  }
}
</style>
