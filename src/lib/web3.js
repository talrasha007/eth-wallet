import _ from 'co-lodash';
import promisify from 'es6-promisify';
import Web3 from 'web3';
import Vue from 'vue';

import { fromNow } from './util';

let web3;
const network = { blockNumber: 0, lastBlockTs: 0, lastBlockTsFromNow: '' };
const account = { address: '', balance: 0 };
const event = new Vue();

if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);

  web3.eth.getBalance = promisify(web3.eth.getBalance);
  web3.eth.getBlockNumber = promisify(web3.eth.getBlockNumber);
  web3.eth.getBlock = promisify(web3.eth.getBlock);
  web3.eth.getTransactionReceipt = promisify(web3.eth.getTransactionReceipt);

  (async () => {
    while (web3) {
      if (web3.eth.accounts.length > 0) {
        // update network info.
        const blockNumber = await web3.eth.getBlockNumber();
        if (network.blockNumber !== blockNumber) {
          network.blockNumber = blockNumber;
          network.lastBlockTs = Date.now();
          event.$emit('new_block', blockNumber);
        }
        network.lastBlockTsFromNow = fromNow(network.lastBlockTs);

        // update account info.
        if (account.address !== web3.eth.accounts[0]) {
          web3.eth.defaultAccount = web3.eth.accounts[0];
          account.address = web3.eth.accounts[0];
          event.$emit('account_changed');
        }

        account.balance = 1 * web3.fromWei(await web3.eth.getBalance(account.address));
      } else {
        Object.assign(network, { blockNumber: 0, lastBlockTs: 0, lastBlockTsFromNow: '' });
        Object.assign(account, { address: '', balance: 0 });
      }

      await _.sleep(1000);
    }

    document.location.hash = '#/error';
  })();
} else {
  document.location.hash = '#/error';
}

export { account, network, event };
export default web3;