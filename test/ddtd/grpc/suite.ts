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

require('./getInfo/GrpcStatus0.spec.ts');
require('./placeOrder/GrpcStatus0.spec.ts');
require('./cancelOrder/GrpcStatus0.spec.ts');

xud.shutdown();
