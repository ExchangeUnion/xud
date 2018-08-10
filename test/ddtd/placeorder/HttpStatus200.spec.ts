import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import dev from '../constants/dev';

const url = dev.protocol + '://' + dev.host + ':' + dev.port + '/api/' + dev.version + '/placeorder';

describe(url, () => {
  chai.use(chaiHttp);

  // TODO

});
