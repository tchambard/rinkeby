import { ethers } from "hardhat";

async function main() {
  const ContactsFactory = await ethers.getContractFactory("Contacts");
  const Contacts = await ContactsFactory.deploy();

  await Contacts.deployed();

  console.log(`> Contacts contract deployed to ${Contacts.address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
