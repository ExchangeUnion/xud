# seedutil
This utility is used to derive an Ethereum keystore file from [aezeed](https://github.com/lightningnetwork/lnd/tree/master/aezeed) generated mnemonic seed.

## Build
`npm run compile:seedutil`

## Usage
It is recommended to use this tool on the command line ONLY for development purposes.
`seedutil [twenty four recovery words separated by space] [optional password] [optional keystore path]`

[Tests](/test/jest/SeedUtil.spec.ts)
