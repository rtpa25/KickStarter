/** @format */

const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x02c6C3E2c226E7D94C982bafa28350119b711c51'
);

module.exports = instance;
