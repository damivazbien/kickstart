const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compileFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'song hockey party noodle shadow air input nasty nephew woman wasp chunk',
    'https://rinkeby.infura.io/v3/c09f2555bffc4747934e2e9e4dbd203d'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attemting to deploy from account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(compileFactory.interface))
        .deploy({ data: compileFactory.bytecode })
        .send({gas: '1000000', from: accounts[0]});
    
    console.log('Contract deployed to' , result.options.address);
};
deploy();