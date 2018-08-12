import Xud from '../../../lib/Xud';

let xud: Xud;
let config: any;

config = {
  webproxy: {
    disable: false,
    port: 8080,
  },
  lnd: {
    disable: true,
  },
  raiden: {
    disable: true,
  },
  db: {
    database: 'xud_test',
  },
};

xud = new Xud(config);

xud.start();

require('./info/HttpStatus200.spec.ts');
require('./placeorder/HttpStatus200.spec.ts');
require('./cancelorder/HttpStatus200.spec.ts');

xud.shutdown();
