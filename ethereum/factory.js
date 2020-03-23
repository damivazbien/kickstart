import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x2c73EDD9233D2dCeFDDb3f922A305b57E2f1791e'
);

export default instance;