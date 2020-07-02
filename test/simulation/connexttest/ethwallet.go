package connexttest

import (
	"context"
	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/miguelmota/go-ethereum-hdwallet"
	"math/big"
)

var (
	gasLimit = uint64(21000)
	gasPrice = big.NewInt(21000000000)
)

type EthWallet struct {
	client  *ethclient.Client
	wallet  *hdwallet.Wallet
	chainID *big.Int

	account accounts.Account
	nonce   uint64
}

func newEthWallet(ethProviderURL string, seedMnemonic string) (*EthWallet, error) {
	client, err := ethclient.Dial(ethProviderURL)
	if err != nil {
		return nil, err
	}

	chainID, err := client.NetworkID(context.Background())
	if err != nil {
		return nil, err
	}

	wallet, err := hdwallet.NewFromMnemonic(seedMnemonic)
	if err != nil {
		return nil, err
	}

	path := hdwallet.MustParseDerivationPath("m/44'/60'/0'/0/0")
	account, err := wallet.Derive(path, true)
	if err != nil {
		return nil, err
	}

	return &EthWallet{
		client,
		wallet,
		chainID,
		account,
		0,
	}, nil
}

func (w *EthWallet) SendEth(recipientHex string, amount *big.Int) error {
	nonce, err := w.client.NonceAt(context.Background(), w.account.Address, nil)
	if err != nil {
		return err
	}

	to := common.HexToAddress(recipientHex)
	tx := types.NewTransaction(nonce, to, amount, gasLimit, gasPrice, []byte(nil))
	signedTx, err := w.wallet.SignTx(w.account, tx, w.chainID)
	if err != nil {
		return err
	}

	if err := w.client.SendTransaction(context.Background(), signedTx); err != nil {
		return err
	}

	return nil
}
