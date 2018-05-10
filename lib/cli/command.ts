import XUClient from '../xuclient/XUClient';
import { Arguments } from 'yargs';

/**
 * A generic function to instantiate an XU client, perform a command, and output the result to the
 * console.
 * @param argv The command line arguments
 * @param callback The callback function to perform a command
 */
export default (argv: Arguments, callback: (XUClient, Arguments) => Promise<any>) => {
  const xuClient = new XUClient(argv.rpc.port, argv.rpc.host);

  const promise = callback(xuClient, argv);

  if (promise) {
    promise.then((result) => {
      console.log(JSON.stringify(result));
    }).catch((err) => {
      console.error(err);
    });
  }
};
