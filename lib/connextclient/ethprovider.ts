import { Observable, from, combineLatest } from 'rxjs';
import { ethers, BigNumber } from 'ethers';
import { mergeMap } from 'rxjs/operators';

type OnChainTransaction = {
  nonce: number;
  gasPrice: BigNumber;
  gasLimit: BigNumber;
  to: string;
  value: BigNumber;
  data: string;
  chainId: number;
  v: number;
  r: string;
  s: string;
  from: string;
  hash: string;
};

const getProvider = (host: string, port: number, name: string, chainId: number): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider(
    { url: `http://${host}:${port}/ethprovider/${chainId}` },
    {
      name,
      chainId,
    },
  );
};

const getSigner = (
  provider: ethers.providers.JsonRpcProvider,
  seed: string,
): ethers.Wallet => {
  return ethers.Wallet.fromMnemonic(seed).connect(provider);
}

const getContract = (signer: ethers.Wallet, contractAddress: string): ethers.Contract => {
  const erc20abi = ['function balanceOf(address) view returns (uint)', 'function transfer(address to, uint amount)'];
  return new ethers.Contract(contractAddress, erc20abi, signer);
};

const onChainSendERC20 = (
  signer: ethers.Wallet,
  contract: ethers.Contract,
  destinationAddress: string,
  units: string,
): Observable<OnChainTransaction> => {
  // convert promises to observables
  const erc20balance$ = from(contract.balanceOf(signer.address)) as Observable<BigNumber>;
  const ethBalance$ = from(signer.provider.getBalance(signer.address));
  const gasPrice$ = from(signer.provider.getGasPrice());
  // gather up all the observables so that we wait for each one to emit a value before
  // we emit ready to transfer event
  const readyToTransfer$ = combineLatest(erc20balance$, ethBalance$, gasPrice$);
  return readyToTransfer$.pipe(
    mergeMap(([_erc20balance, _ethBalance, gasPrice]) => {
      // const amountToSend = erc20balance.div(10);
      return from(contract.transfer(destinationAddress, units, { gasPrice })) as Observable<OnChainTransaction>;
    }),
  );
};

export { getProvider, getSigner, getContract, onChainSendERC20 };
