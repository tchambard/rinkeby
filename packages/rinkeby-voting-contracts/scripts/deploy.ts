import { ethers } from "hardhat";

async function main() {
  const VotingFactory = await ethers.getContractFactory("Voting");
  const voting = await VotingFactory.deploy();

  await voting.deployed();

  console.log(`> Voting contract deployed to ${voting.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
