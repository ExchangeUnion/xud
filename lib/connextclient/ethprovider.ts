import { ethers } from 'ethers';
import { curry } from 'ramda';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// This file will be a separate module with the above dependencies.

// gets the Ethereum provider object to read data from the chain
const getProvider = (host: string, port: number, chainId: number): ethers.providers.JsonRpcProvider => {
  return new ethers.providers.JsonRpcProvider({ url: `http://${host}:${port}/ethprovider/${chainId}` });
};

// gets the signer object necessary for write access (think unlock wallet)
const getSigner = (provider: ethers.providers.JsonRpcProvider, seed: string): ethers.Wallet => {
  return ethers.Wallet.fromMnemonic(seed).connect(provider);
};

// We curry getContract so that we can provide its arguments one at a time.
// This allows us to provide some of the necessary arguments (that we already have) before we export the function.
// Read more: https://ramdajs.com/docs/#curry
const getContract = curry(
  (signer: ethers.Wallet, contractAddress: string): ethers.Contract => {
    // we use the minimum viable contract ABI for ERC20 tokens
    // for full contract ABI we should compile it from the solidity source
    const erc20abi = ['function balanceOf(address) view returns (uint)', 'function transfer(address to, uint amount)'];
    return new ethers.Contract(contractAddress, erc20abi, signer);
  },
);

// Sends on-chain ERC20 transfer
// We also curry this function, just like the previous one.
// All the functions that we export out of the package will be curried
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

// Sends on-chain ETH transfer
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

// returns ETH on-chain balance for the address in wei
const getEthBalanceByAddress = curry((provider: ethers.providers.JsonRpcProvider, address: string) =>
  from(provider.getBalance(address)),
);

// returns ERC20 on-chain balance for the contract address in the smallest unit
const getERC20Balance = curry(
  (address: string, contract: ethers.Contract): Observable<ethers.BigNumber> => {
    return from(contract.balanceOf(address)) as Observable<ethers.BigNumber>;
  },
);

// This is the main function that has to be called before this package exposes more functions.
// Think of it as a constructor where we create the interal state of the module before
// we export more functionality to the consumer.
const getEthprovider = (host: string, port: number, chainId: number, seed: string) => {
  // create the internal state
  const provider = getProvider(host, port, chainId);
  const signer = getSigner(provider, seed);
  // because the functions below are curried we can only provide some of the arguments
  const getERC20BalanceWithSigner = getERC20Balance(signer.address);
  const getContractWithSigner = getContract(signer);
  const onChainSendERC20WithSigner = onChainSendERC20(signer);
  const onChainSendETHWithSigner = onChainSendETH(signer);
  const getEthBalanceByAddressWithProvider = getEthBalanceByAddress(provider);
  const onChainTransfer = (contractAddress: string, destinationAddress: string, units: string) => {
    if (contractAddress === ethers.constants.AddressZero) {
      return onChainSendETHWithSigner(destinationAddress, units);
    } else {
      const contract = getContractWithSigner(contractAddress);
      return onChainSendERC20WithSigner(contract, destinationAddress, units);
    }
  };
  // expose functionality to the consumer
  return {
    getEthBalance: () => from(signer.getBalance()),
    getEthBalanceByAddress: getEthBalanceByAddressWithProvider,
    getContract: getContractWithSigner,
    getERC20Balance: getERC20BalanceWithSigner,
    getERC20BalanceByAddress: getERC20Balance,
    onChainTransfer,
  };
};

type EthProvider = ReturnType<typeof getEthprovider>;

export { getEthprovider, EthProvider };
