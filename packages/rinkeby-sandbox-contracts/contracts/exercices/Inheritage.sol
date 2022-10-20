// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17.0;

contract Parent {
    uint value;

    function setValue(uint _value) external {
        value = _value;
    }

}

contract Child is Parent {
    function getValue() external view returns (uint) {
        return value;
    }
}

contract Caller {

    Child public child = new Child();
 
    function getChildValue() external returns (uint) {
        child.setValue(10);
        return child.getValue();
    }
}