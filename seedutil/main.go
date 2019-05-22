package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"fmt"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/lightningnetwork/lnd/aezeed"
	"os"
	"path/filepath"
)

var (
	// defaultPassphrase is the default passphrase that will
	// be used for decryption
	defaultPassphrase = []byte("aezeed")
	// masterKey is the master key used along with a random seed used to generate
	// the master node in the hierarchical tree.
	masterKey = []byte("Bitcoin seed")
	// by default we will generate the keystore file into the keystore directory
	// relative to the execution directory
	defaultKeyStorePath = filepath.Join(filepath.Dir(os.Args[0]), "keystore")
)

func main() {
	if len(os.Args[1:]) < aezeed.NummnemonicWords {
		fmt.Fprintf(os.Stderr, "\nerror: expecting %v-word mnemonic seed separated by a space, followed by an optional password", aezeed.NummnemonicWords)
		os.Exit(1)
	}

	passphrase := defaultPassphrase
	if len(os.Args[1:]) > aezeed.NummnemonicWords {
		// use provided password
		passphrase = []byte(os.Args[25])
	}

	// parse seed from args
	var mnemonic aezeed.Mnemonic
	copy(mnemonic[:], os.Args[1:25])

	// map back to cipher
	cipherSeed, err := mnemonic.ToCipherSeed(passphrase)
	if err != nil {
		fmt.Fprint(os.Stderr, "\nerror: invalid seed or password")
		os.Exit(1)
	}

	// derive 64-byte key from cipherSeed's 16 bytes of entropy
	hmac512 := hmac.New(sha512.New, masterKey)
	hmac512.Write(cipherSeed.Entropy[:])
	lr := hmac512.Sum(nil)

	// we don't care about the chain code because we're not deriving
	// extended keys from the master
	masterSecretKey := lr[:len(lr)/2]

	// perform validations and convert bytes to ecdsa.PrivateKey
	privateKey, err := crypto.ToECDSA(masterSecretKey)
	if err != nil {
		fmt.Fprint(os.Stderr, "\nerror: failed to convert masterSecretKey bytes to ecdsa.PrivateKey")
		os.Exit(1)
	}

	// get directory for saving the keystore file
	keystorePath := defaultKeyStorePath
	if len(os.Args[1:]) > aezeed.NummnemonicWords+1 {
		// use use provided path if provided
		keystorePath = os.Args[26]
	}
	dir, err := filepath.Abs(keystorePath)
	if err != nil {
		fmt.Fprint(os.Stderr, "\nerror: failed to get directory for keystore")
		os.Exit(1)
	}

	// generate keystore file
	ks := keystore.NewKeyStore(dir, keystore.StandardScryptN, keystore.StandardScryptP)

	// import our ecdsa.PrivateKey to our new keystore
	_, err = ks.ImportECDSA(privateKey, string(passphrase))
	if err != nil {
		fmt.Fprintf(os.Stderr, "\nerror: failed to import key to keystore - %v\n", err)
		os.Exit(1)
	}
	fmt.Print("\nKeystore created.")
}
