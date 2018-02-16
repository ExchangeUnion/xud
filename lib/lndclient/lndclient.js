const grpc = require('grpc');
const fs = require('fs');
const config = require('../config');

const lndCert = fs.readFileSync(`${config.LND_HOMEDIR}/tls.cert`);
const credentials = grpc.credentials.createSsl(lndCert);
const lnrpcDescriptor = grpc.load('../../rpc.proto');
const lightning = new lnrpcDescriptor.lnrpc.Lightning('127.0.0.1:10009', credentials);

const adminMacaroon = fs.readFileSync(`${config.LND_HOMEDIR}admin.macaroon`);
const meta = new grpc.Metadata();
meta.add('macaroon', adminMacaroon.toString('hex'));

function getInfo() {
  return new Promise((resolve, reject) => {
    lightning.getInfo({}, meta, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
exports.getInfo = getInfo;
