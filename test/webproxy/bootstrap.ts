export function getConfig(port: any): any {
  return {
    dbpath: ':memory:',
    initdb: false,
    webproxy: {
      port,
      disable: false,
    },
    logpath: '',
    loglevel: 'warn',
    p2p: {
      listen: false,
    },
    lndbtc: {
      disable: true,
    },
    lndltc: {
      disable: true,
    },
    raiden: {
      disable: true,
    },
  };
}
