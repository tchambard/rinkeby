// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;
 
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 
contract AlyraERC20Token is ERC20 {
    constructor(uint256 initialSupply) ERC20("Alyra", "ALY") {
       _mint(msg.sender, initialSupply);
    }
}
