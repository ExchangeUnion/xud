package main

import (
	"crypto/hmac"
	"crypto/sha512"
	"encoding/binary"
	"encoding/hex"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

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

func parseMnemonic(words []string) aezeed.Mnemonic {
	if len(words) < aezeed.NummnemonicWords {
		fmt.Fprintf(os.Stderr, "\nerror: expecting %v-word mnemonic seed separated by spaces\n", aezeed.NummnemonicWords)
		os.Exit(1)
	}

	// parse seed from args
	var mnemonic aezeed.Mnemonic
	copy(mnemonic[:], words[0:24])

	return mnemonic
}

func mnemonicToCipherSeed(mnemonic aezeed.Mnemonic, aezeedPassphrase *string) *aezeed.CipherSeed {
	// map back to cipher
	aezeedPassphraseBytes := []byte(*aezeedPassphrase)
	cipherSeed, err := mnemonic.ToCipherSeed(aezeedPassphraseBytes)
	if err != nil {
		fmt.Fprintln(os.Stderr, "\nerror: invalid aezeed:", err)
		os.Exit(1)
	}

	return cipherSeed
}

func main() {
	keystoreCommand := flag.NewFlagSet("keystore", flag.ExitOnError)
	encipherCommand := flag.NewFlagSet("encipher", flag.ExitOnError)
	decipherCommand := flag.NewFlagSet("decipher", flag.ExitOnError)
	generateCommand := flag.NewFlagSet("generate", flag.ExitOnError)
	deriveChildCommand := flag.NewFlagSet("derivechild", flag.ExitOnError)

	if len(os.Args) < 2 {
		fmt.Println("subcommand is required")
		os.Exit(1)
	}

	var args []string
	switch os.Args[1] {
	case "keystore":
		password := keystoreCommand.String("pass", "", "encryption password")
		keystorePath := keystoreCommand.String("path", defaultKeyStorePath, "path to create keystore dir")
		aezeedPassphrase := keystoreCommand.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
		keystoreCommand.Parse(os.Args[2:])
		args = keystoreCommand.Args()

		mnemonic := parseMnemonic(args)
		cipherSeed := mnemonicToCipherSeed(mnemonic, aezeedPassphrase)

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

		fmt.Println("Keystore created in", dir)
	case "encipher":
		aezeedPassphrase := encipherCommand.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
		encipherCommand.Parse(os.Args[2:])
		args = encipherCommand.Args()

		if len(args) == 0 {
			fmt.Fprintln(os.Stderr, "missing hex string")
			os.Exit(1)
		}
		decipheredSeedHex := args[0]
		decipheredSeed, err := hex.DecodeString(decipheredSeedHex)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		if len(decipheredSeed) != 19 {
			fmt.Fprintf(os.Stderr, "\nerror: invalid hex length of %v bytes\n", len(decipheredSeed))
			os.Exit(1)
		}

		internalVersion := decipheredSeed[0]
		birthday := binary.BigEndian.Uint16(decipheredSeed[1:3])
		var entropy [16]byte
		copy(entropy[:], decipheredSeed[3:19])

		genesisTime := time.Date(2009, time.January, 3, 18, 15, 5, 0, time.UTC)

		cipherSeed, err := aezeed.New(internalVersion, &entropy, genesisTime.AddDate(0, 0, int(birthday)))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		mnemonic, err := cipherSeed.ToMnemonic([]byte(*aezeedPassphrase))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		fmt.Println(strings.Join([]string(mnemonic[:]), " "))
	case "decipher":
		aezeedPassphrase := decipherCommand.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
		decipherCommand.Parse(os.Args[2:])
		args = decipherCommand.Args()

		mnemonic := parseMnemonic(args)
		decipheredSeed, err := mnemonic.Decipher([]byte(*aezeedPassphrase))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		fmt.Println(hex.EncodeToString(decipheredSeed[:]))
	case "derivechild":
		client := deriveChildCommand.String("client", "", "client type")
		aezeedPassphrase := deriveChildCommand.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
		deriveChildCommand.Parse(os.Args[2:])
		args = deriveChildCommand.Args()

		if client == nil || len(*client) == 0 {
			fmt.Fprintf(os.Stderr, "client is required")
			os.Exit(1)
		}

		mnemonic := parseMnemonic(args)
		cipherSeed := mnemonicToCipherSeed(mnemonic, aezeedPassphrase)

		// derive 64-byte hash from client type + cipherSeed's 16 bytes of entropy
		hash := sha512.Sum512(append([]byte(*client), cipherSeed.Entropy[:]...))

		// use the first 16 byte of the hash as the new entropy
		var newEntropy [16]byte
		copy(newEntropy[:], hash[:16])

		childCipherSeed, err := aezeed.New(0, &newEntropy, cipherSeed.BirthdayTime())
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		childMnemonic, err := childCipherSeed.ToMnemonic([]byte(*aezeedPassphrase))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		fmt.Println(strings.Join([]string(childMnemonic[:]), " "))
	case "generate":
		aezeedPassphrase := generateCommand.String("aezeedpass", defaultAezeedPassphrase, "aezeed passphrase")
		generateCommand.Parse(os.Args[2:])

		cipherSeed, err := aezeed.New(0, nil, time.Now())
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		mnemonic, err := cipherSeed.ToMnemonic([]byte(*aezeedPassphrase))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}

		fmt.Println(strings.Join([]string(mnemonic[:]), " "))
	default:
		flag.PrintDefaults()
		os.Exit(1)
	}
}
