// SPDX-License-Identifier: GPL-3.0 

pragma solidity 0.8.17.0; 

contract SimpleStoragePayable { 
    uint value;

    constructor() payable {

    }
    
    function get() external view returns(uint) {
        return value;
    }
    
    function set(uint n) external {
        value = n;
    }
    
} 