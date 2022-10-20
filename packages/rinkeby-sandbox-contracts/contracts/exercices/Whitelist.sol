// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17.0;
 
contract Whitelist {
    mapping(address=> bool) whitelist;
    event Authorized(address _address);

    function authorize(address _address) public check {
        whitelist[_address] = true;
        emit Authorized(_address);
    }

    modifier check() {
        require(whitelist[msg.sender] == true, 'not authorized');
        _;
    }
}
