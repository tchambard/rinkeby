/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { OwnableContract } from "./Ownable";
import { VotingContract } from "./Voting";

declare global {
  namespace Truffle {
    interface Artifacts {
      require(name: "Ownable"): OwnableContract;
      require(name: "Voting"): VotingContract;
    }
  }
}

export { OwnableContract, OwnableInstance } from "./Ownable";
export { VotingContract, VotingInstance } from "./Voting";
