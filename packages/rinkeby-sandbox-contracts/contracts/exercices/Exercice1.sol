// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.7;

contract Ex1 {
    address state;

    function setState(address _state) public {
        require(_state != address(0), "Can't set address 0");

        state = _state;
    }

    function getBalance() public view returns(uint) {
        return state.balance;
    }

    function getBalanceForAddress(address _addr) public view returns(uint) {
        return _addr.balance;
    }

    function sendEth (address _destination) payable  public {
        (bool sent,) = payable(_destination).call{value:msg.value}("");
        require(sent, unicode"eth non transférés");
    }
}