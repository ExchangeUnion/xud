import { BigNumber, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { curry } from 'ramda';

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

const getSigner = (provider: ethers.providers.JsonRpcProvider, seed: string): ethers.Wallet => {
  return ethers.Wallet.fromMnemonic(seed).connect(provider);
};

const getContract = curry(
  (signer: ethers.Wallet, contractAddress: string): ethers.Contract => {
    const erc20abi = ['function balanceOf(address) view returns (uint)', 'function transfer(address to, uint amount)'];
    return new ethers.Contract(contractAddress, erc20abi, signer);
  },
);

const onChainSendERC20 = curry(
  (
    signer: ethers.Wallet,
    contract: ethers.Contract,
    destinationAddress: string,
    units: string,
  ): Observable<OnChainTransaction> => {
    // get the gas price
    return from(signer.provider.getGasPrice()).pipe(
      mergeMap(
        (gasPrice) =>
          // then send the transaction
          from(contract.transfer(destinationAddress, units, { gasPrice })) as Observable<OnChainTransaction>,
      ),
    );
  },
);

const getEthprovider = (host: string, port: number, name: string, chainId: number, seed: string) => {
  const provider = getProvider(host, port, name, chainId);
  const signer = getSigner(provider, seed);
  return {
    getContract: getContract(signer),
    onChainSendERC20: onChainSendERC20(signer),
  };
};

type EthProvider = ReturnType<typeof getEthprovider>;

export { getEthprovider, EthProvider };
