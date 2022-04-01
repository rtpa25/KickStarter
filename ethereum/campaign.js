/** @format */

const web3 = require('./web3');
const Campaign = require('./build/Campaighn.json');

export default (address) => {
  return new web3.eth.Contract(Campaign.abi, address);
};
