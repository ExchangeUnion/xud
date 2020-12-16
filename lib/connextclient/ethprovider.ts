import { ethers } from 'ethers';
import { curry } from 'ramda';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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
  ): Observable<ethers.ContractTransaction> => {
    // get the gas price
    return from(signer.provider.getGasPrice()).pipe(
      mergeMap(
        (gasPrice) =>
          // then send the transaction
          from(contract.transfer(destinationAddress, units, { gasPrice })) as Observable<ethers.ContractTransaction>,
      ),
    );
  },
);

const getERC20Balance = curry((signer: ethers.Wallet, contract: ethers.Contract): Observable<ethers.BigNumber> => {
  return from(contract.balanceOf(signer.address)) as Observable<ethers.BigNumber>;
});

const getEthprovider = (host: string, port: number, name: string, chainId: number, seed: string) => {
  const provider = getProvider(host, port, name, chainId);
  const signer = getSigner(provider, seed);
  return {
    getEthBalance: () => from(signer.getBalance()),
    getContract: getContract(signer),
    getERC20Balance: getERC20Balance(signer),
    onChainSendERC20: onChainSendERC20(signer),
  };
};

type EthProvider = ReturnType<typeof getEthprovider>;

export { getEthprovider, EthProvider };
