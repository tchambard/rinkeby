import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-truffle5";
import "hardhat-gas-reporter";

require('dotenv').config();
const { MNEMONIC, INFURA_ID } = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    },
  },
  typechain: {
    outDir: 'types/truffle',
    target: 'truffle-v5',
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
  },
  gasReporter: {
    currency: 'EUR',
    enabled: (process.env.REPORT_GAS) ? true : false,
    showTimeSpent: true,
  }
};

if (INFURA_ID && MNEMONIC) {
  config.networks!.goerli = {
    url: `https://goerli.infura.io/v3/${INFURA_ID}`,
    accounts: { mnemonic: MNEMONIC }
  };
}

export default config;
