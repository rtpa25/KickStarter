/** @format */

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaighn.json');

let accounts;
let factory;
let campaignAdress;
let campaign;

beforeEach(async () => {
  //get all the demo accounts
  accounts = await web3.eth.getAccounts();

  //get the campaign factory instance
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({
      from: accounts[0],
      gas: '10000000',
    });

  //deploy a new campaign from the factory
  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '10000000',
  });

  //get all the deployed campaigns
  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAdress = addresses[0];

  //accessing the already deployed instance
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAdress);
});

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('people are able to become contributors', async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: '200',
    });

    isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribuion', async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: '5',
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy Batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '10000000',
      });

    const request = await campaign.methods.requests(0).call();
    assert.equal('Buy Batteries', request.description);
  });

  it('processes requsts', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '10000000',
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '10000000',
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '10000000',
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
