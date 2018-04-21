const XUClient = require('../xuclient/XUClient');

/**
 * A generic function to instantiate an XU client, perform a command, and output the result to the
 * console.
 * @param {object} argv - The command line arguments
 * @param {function} callback - The callback function to perform a command
 */
module.exports = (argv, callback) => {
  const xuClient = new XUClient(argv.rpcport);

  const promise = callback(xuClient, argv);

  if (promise) {
    promise.then((result) => {
      console.log(JSON.stringify(result));
    }).catch((err) => {
      console.error(err);
    });
  }
};
