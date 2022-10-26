// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

interface Deployed{
    function set (uint num) external;
    function get() external view returns (uint);
}

contract Existing {

    Deployed dc;

    function call(address _addr) public {
        dc = Deployed(_addr);
    }

    function getA () public view returns (uint result){
        return dc.get();
    }

    function setA(uint _val) public{
        dc.set(_val);
    }

}