const {procesLatlng} = require('./src/node-spider') 

if (require.main === module) {
    procesLatlng(23.3488500800, 112.4821141700, 21.6283230000, 115.0540240000, 10, 'gaode', 'gaode')
}
// _download();
//  processTilenum(803,857,984,1061,8,'WORKNET')
// checkout()