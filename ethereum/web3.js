import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    // We are in the browser and matamask is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    // we are on the server Or the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/c09f2555bffc4747934e2e9e4dbd203d'
    );
    web3 = new Web3(provider);
}

export default web3;

