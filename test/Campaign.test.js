const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compileFactory = require('../ethereum/build/CampaignFactory.json');
const compaileCampaign = require('../ethereum/build/Campaign.json');

// the account in ganache 
let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    
    factory = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
       .deploy({ data: compileFactory.bytecode })    
       .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compaileCampaign.interface),
        campaignAddress
    );

});

describe('Campaigns', () => {
   it('deploys a factory and a campaign', () => {
       assert.ok(factory.options.address);
       assert.ok(campaign.options.address);
   });
   
   it ('marks caller as a manager', async () => {
    const manager = await campaign.methods.manager().call();
    console.log(accounts[0]);
    assert.equal(accounts[0], manager);
});

it ('allows people to contribute ether and make themk as approvers', async () => {
    await campaign.methods.contribute().send({
        value: '200',
        from: accounts[1]
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
});

it ('requires a minimun contribution', async () => {
    try {
        await campaign.methods.contribute().send({
            value: '5',
            from: accounts[1]
        })
        assert(false);
    }
    catch(err){
        assert(err);
    }
});

it ('allows a manager to create a request', async () => {
    await campaign.methods.createRequest(
        'Test request',
        '100',
        accounts[1]
    ).send({
        from: accounts[0],
        gas: '1000000'
    });

    const request = await campaign.methods.requests(0).call();
    assert.equal('Test request', request.description);
});

it ('processes a request', async () => {
    await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei('10','ether')
    });

        await campaign.methods.createRequest(
            'Test request',
            web3.utils.toWei('5','ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance)
        assert(balance > 104);
    });
});