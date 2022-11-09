import Web3 from 'web3';

import { contracts } from 'rinkeby-voting-contracts';
import {
	getContractInfo,
	IDynamicContractImportDefinitions,
} from 'src/eth-network/helpers';

const imports: IDynamicContractImportDefinitions = {
	localhost: () => import('rinkeby-voting-contracts/deployments/localhost.json'),
	goerli: () => import('rinkeby-voting-contracts/deployments/goerli.json'),
	mumbai: () => import('rinkeby-voting-contracts/deployments/mumbai.json'),
};

export async function getVotingContract(web3: Web3): Promise<contracts.Voting> {
	const contractInfo = await getContractInfo(web3, imports, 'Voting');
	return new web3.eth.Contract(
		contractInfo.abi,
		contractInfo.address,
	) as unknown as contracts.Voting;
}
