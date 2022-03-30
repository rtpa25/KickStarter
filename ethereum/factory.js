/** @format */

const web3 = require('./web3');
const CampaignFactory = require('./build/CampaignFactory.json');

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x7f92Cbf5A000B78B66Dd57C08dDf543C2197453a'
);

module.exports = instance;
