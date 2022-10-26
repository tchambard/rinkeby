// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';

contract Saving is Ownable {
    
    uint firstDepositDate;

    mapping(uint => uint) private history;

    uint private depositsCount;

    event Deposit(address sender, uint amount);

    event Withdraw(uint amount);

    // modifier isAdmin() {
    //     require(msg.sender == admin, 'Forbidden');
    //     _;
    // }

    receive() external payable {
        history[depositsCount] = msg.value;
        depositsCount++;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() external payable onlyOwner {
        require(firstDepositDate != 0, 'withdraw forbidden before first deposit');

        uint nbDaysSinceFirstDeposit = (firstDepositDate - block.timestamp) / 60 / 60 / 24;
        require(nbDaysSinceFirstDeposit > 90, 'withdraw forbidden before 90 days after first deposit');

        (bool sent,) = msg.sender.call{value:address(this).balance}('');
        require(sent, 'withdraw failed');

        emit Withdraw(msg.value);
    }

    function getDeposit(uint index) external view onlyOwner returns (uint) {
        return history[index];
    }
}