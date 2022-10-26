// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;

import '@openzeppelin/contracts/access/Ownable.sol';
 
contract ERC20Token is Ownable {

    mapping(address=> bool) private _whitelist;
    mapping(address=> bool) private _blacklist;
    event Whitelisted(address _address);
    event Blacklisted(address _address);

    function whitelist(address _address) public onlyOwner {
        require(!_blacklist[_address], 'already blacklisted');
        require(!_whitelist[_address], 'already whitelisted');
        _whitelist[_address] = true;
        emit Whitelisted(_address);
    }

    function blacklist(address _address) public onlyOwner {
        require(!_blacklist[_address], 'already blacklisted');
        require(!_whitelist[_address], 'already whitelisted');
        _blacklist[_address] = true;
        emit Blacklisted(_address);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return _whitelist[_address];
    }

    function isBlacklisted(address _address) public view returns(bool) {
        return _blacklist[_address];
    }
}
