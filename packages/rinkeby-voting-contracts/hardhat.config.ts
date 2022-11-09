import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-truffle5';
import 'hardhat-gas-reporter';
import 'hardhat-deploy';

require('dotenv').config();
const {
	MNEMONIC,
	GOERLI_PRIVATE_KEY,
	INFURA_API_KEY,
	POLYGONSCAN_API_KEY,
	ALCHEMY_API_KEY,
	MUMBAI_PRIVATE_KEY,
} = process.env;

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.17',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	typechain: {
		outDir: 'types/truffle',
		target: 'truffle-v5',
	},
	networks: {
		localhost: {
			url: 'http://localhost:8545/',
		},
	},
	gasReporter: {
		currency: 'EUR',
		enabled: process.env.REPORT_GAS ? true : false,
		showTimeSpent: true,
	},
};

if (INFURA_API_KEY && GOERLI_PRIVATE_KEY) {
	config.networks!.goerli = {
		url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
		accounts: [GOERLI_PRIVATE_KEY],
	};
}
if (ALCHEMY_API_KEY && MUMBAI_PRIVATE_KEY) {
	config.networks!.mumbai = {
		url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
		accounts: [MUMBAI_PRIVATE_KEY],
	};
	if (POLYGONSCAN_API_KEY) {
		config.etherscan = {
			apiKey: process.env.POLYGONSCAN_API_KEY,
		};
	}
}

export default config;
