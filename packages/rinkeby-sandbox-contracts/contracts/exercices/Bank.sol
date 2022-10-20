// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17.0;
 
contract Bank {
   mapping(address => uint) _balances;

   function deposit(uint _amout) public {
       _balances[msg.sender] += _amout;
   }

   function transer(address _recipient, uint _amout) public {
        require(_recipient != address(0), 'You cannot transfer to the address zero');
        require(_balances[msg.sender] >= _amout, 'balance is too low');
        _balances[msg.sender] -= _amout;
        _balances[_recipient] += _amout;
   }

   function balanceOf(address _address) public view returns (uint){
       return _balances[_address];
   }
}
