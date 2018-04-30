import XUClient from 'lib/xuclient/XUClient';

/**
 * A generic function to instantiate an XU client, perform a command, and output the result to the
 * console.
 * @param {object} argv - The command line arguments
 * @param {function} callback - The callback function to perform a command
 */
export default (argv, callback) => {
  const xuClient = new XUClient(argv.rpc.port);

  const promise = callback(xuClient, argv);

  if (promise) {
    promise.then((result) => {
      console.log(JSON.stringify(result));
    }).catch((err) => {
      console.error(err);
    });
  }
};
