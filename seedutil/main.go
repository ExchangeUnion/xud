package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/lightningnetwork/lnd/aezeed"
)

var (
	// defaultPassphrase is the default passphrase that will
	// be used for the seed
	defaultAezeedPassphrase = "aezeed"
	// masterKey is the master key used along with a random seed used to generate
	// the master node in the hierarchical tree.
	masterKey = []byte("Bitcoin seed")
	// by default we will generate the keystore file into the keystore directory
	// relative to the execution directory
	defaultKeyStorePath = filepath.Join(filepath.Dir(os.Args[0]))
)

func main() {
	password := flag.String("pass", "", "encryption password")
	keystorePath := flag.String("path", defaultKeyStorePath, "path to create keystore dir")
	aezeedPassphrase := flag.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
	flag.Parse()
	args := flag.Args()

	if len(args) < aezeed.NummnemonicWords {
		fmt.Fprintf(os.Stderr, "\nerror: expecting password and %v-word mnemonic seed separated by spaces\n", aezeed.NummnemonicWords)
		os.Exit(1)
	}

	// parse seed from args
	var mnemonic aezeed.Mnemonic
	copy(mnemonic[:], args[0:24])

	// map back to cipher
	aezeedPassphraseBytes := []byte(*aezeedPassphrase)
	cipherSeed, err := mnemonic.ToCipherSeed(aezeedPassphraseBytes)
	if err != nil {
		fmt.Fprintln(os.Stderr, "\nerror: invalid aezeed:", err)
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
		fmt.Fprintln(os.Stderr, "\nerror: failed to convert masterSecretKey bytes to ecdsa.PrivateKey")
		os.Exit(1)
	}

	dir, err := filepath.Abs(filepath.Join(*keystorePath, "keystore"))
	if err != nil {
		fmt.Fprintln(os.Stderr, "\nerror: failed to get directory for keystore")
		os.Exit(1)
	}

	// generate keystore file
	ks := keystore.NewKeyStore(dir, keystore.StandardScryptN, keystore.StandardScryptP)

	// import our ecdsa.PrivateKey to our new keystore
	_, err = ks.ImportECDSA(privateKey, *password)
	if err != nil {
		fmt.Fprintf(os.Stderr, "\nerror: failed to import key to keystore - %v\n", err)
		os.Exit(1)
	}

	fmt.Println("\nKeystore created in", dir)
}
