import _ from 'co-lodash';
import promisify from 'es6-promisify';
import Web3 from 'web3';
import Vue from 'vue';

let web3;
const account = { address: '', balance: 0 };
const event = new Vue();

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);

  web3.eth.getBalance = promisify(web3.eth.getBalance);

  (async () => {
    while (web3) {
      if (web3.eth.accounts.length > 0) {
        if (account.address !== web3.eth.accounts[0]) {
          account.address = web3.eth.accounts[0];
          event.$emit('account_changed');
        }

        account.balance = 1 * web3.fromWei(await web3.eth.getBalance(account.address));
      } else {
        document.location.hash = '#/error';
      }

      await _.sleep(1000);
    }

    document.location.hash = '#/error';
  })();
}

export { account, event };
export default web3;