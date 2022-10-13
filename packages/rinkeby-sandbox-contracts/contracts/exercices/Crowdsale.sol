// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.17;
 
import "./AlyraERC20Token.sol";
 
contract Crowdsale {
   uint public rate = 200; // le taux à utiliser
   AlyraERC20Token public token; // L’instance ERC20Token à déployer 
 
   constructor(uint256 initialSupply) {
       token = new AlyraERC20Token(initialSupply);
   }

    receive() external payable {
       require(msg.value >= 0.1 ether, "you can't send less than 0.1 ether");
       distribute(msg.value);
   }

    function distribute(uint256 amount) internal {
       uint256 tokensToSent = amount * rate;
       token.transfer(msg.sender, tokensToSent);
    }
}
