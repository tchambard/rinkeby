const Contacts = artifacts.require("./Contacts.sol");

contract("Contacts", accounts => {
  it("...should store the value 'Hello Blockchain'.", async () => {
    const contactsInstance = await HelloBlockchain.deployed();

    // Set value of Hello World
    await contactsInstance.createContact("Ted", { from: accounts[0] });

    // Get stored value
    const storedData = await contactsInstance.count.call();

    assert.equal(storedData, 1, "The value 'Hello Blockchain' was not stored.");
  });
});
