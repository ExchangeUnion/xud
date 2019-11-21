# seedutil

This utility is used to derive an Ethereum keystore file from [aezeed](https://github.com/lightningnetwork/lnd/tree/master/aezeed) generated mnemonic seed.

## Build

Go 1.12 or greater must be installed and added to your `PATH` to build the seedutil tool from source.

`npm run compile:seedutil`

## Usage

It is recommended to use this tool on the command line ONLY for development purposes.

### Generate Ethereum Keystore

`seedutil keystore [-pass=encryption password] [-path=optional/keystore/path] [-aezeedpass=optional_seed_pass] <twenty four recovery words separated by spaces>`

By default the `keystore` folder will be created in the execution directory and the aezeed password will be `aezeed`.

### Encipher seed

Prints an enciphered seed in hex format from a provided mnemonic.

`seedutil encipher [-aezeedpass=optional_seed_pass] <twenty four recovery words separated by spaces>`

## Tests

`npm run test:seedutil`
