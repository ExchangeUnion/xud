import { Arguments } from 'yargs';
import { GetMnemonicRequest, GetEthMnemonicResponse } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { ethers } from 'ethers';

const formatOutput = (response: GetEthMnemonicResponse.AsObject) => {
  const { seedMnemonic } = response;
  console.log(`Your Ethereum account mnemonic seed is: "${seedMnemonic}"`);
  const wallet = ethers.Wallet.fromMnemonic(seedMnemonic);
  console.log(`\nAlternatively, you can also use the following private key to import account with MetaMask: "${wallet.privateKey}"`);
  console.log('\nHow to import an account: https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-Account');
};

export const command = 'getethmnemonic';

export const describe = 'show the Ethereum seed mnemonic';

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).getETHMnemonic(new GetMnemonicRequest(), callback(argv, formatOutput));
};
