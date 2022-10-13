// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

contract Contacts {
  uint _count = 0; // state variable
  
  struct Contact {
    uint id;
    string name;
    string phone;
  }

  event ContactAdded(uint id);

  mapping(uint => Contact) public contacts;
  
  function count() public view returns (uint) {
    return _count;
  }

  function createContact(string memory _name, string memory _phone) public {
    _count++;
    contacts[_count] = Contact(_count, _name, _phone);
    emit ContactAdded(_count);
  }
}