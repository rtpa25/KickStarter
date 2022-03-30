/** @format */

const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  process.env.FACTORY_ADDRESS
);

module.exports = instance;
