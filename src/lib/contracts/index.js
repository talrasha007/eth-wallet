import promisify from 'es6-promisify';
import web3 from '../web3';

export function loadContract(abi, address) {
  const instance = web3.eth.contract(abi).at(address);

  abi.forEach(api => {
    if (api.type === 'function') {
      instance[api.name] = promisify(instance[api.name]);
    }
  });

  return instance;
}

export function loadTtl(address) {
  const abi = require('./TTLToken.json');
  return loadContract(abi, address);
}