import { ethers } from 'ethers';
import { curry } from 'ramda';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// This file will be a separate module with the above dependencies.

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

// we curry the functions below so that arguments
// can be provided 1 by 1 if necessary
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

const onChainSendETH = curry(
  (signer: ethers.Wallet, destinationAddress: string, units: string): Observable<ethers.ContractTransaction> => {
    return from(signer.provider.getGasPrice()).pipe(
      mergeMap((gasPrice) => {
        const ether = ethers.utils.formatEther(units);
        const value = ethers.utils.parseEther(ether);
        return signer.sendTransaction({
          to: destinationAddress,
          value,
          gasPrice,
        });
      }),
    );
  },
);

const getEthBalanceByAddress = curry((provider: ethers.providers.JsonRpcProvider, address: string) =>
  from(provider.getBalance(address)),
);

const getERC20Balance = curry(
  (address: string, contract: ethers.Contract): Observable<ethers.BigNumber> => {
    return from(contract.balanceOf(address)) as Observable<ethers.BigNumber>;
  },
);

const getEthprovider = (host: string, port: number, name: string, chainId: number, seed: string) => {
  const provider = getProvider(host, port, name, chainId);
  const signer = getSigner(provider, seed);
  return {
    getEthBalance: () => from(signer.getBalance()),
    // before exposing the functions we provide signer and provider
    // when required
    getEthBalanceByAddress: getEthBalanceByAddress(provider),
    getContract: getContract(signer),
    getERC20Balance: getERC20Balance(signer.address),
    getERC20BalanceByAddress: getERC20Balance,
    onChainSendERC20: onChainSendERC20(signer),
    onChainSendETH: onChainSendETH(signer),
  };
};

type EthProvider = ReturnType<typeof getEthprovider>;

export { getEthprovider, EthProvider };
