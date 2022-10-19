/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type ContactAdded = ContractEventLog<{
  id: string;
  0: string;
}>;

export interface Contacts extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Contacts;
  clone(): Contacts;
  methods: {
    contacts(arg0: number | string | BN): NonPayableTransactionObject<{
      id: string;
      name: string;
      phone: string;
      0: string;
      1: string;
      2: string;
    }>;

    count(): NonPayableTransactionObject<string>;

    createContact(
      _name: string,
      _phone: string
    ): NonPayableTransactionObject<void>;
  };
  events: {
    ContactAdded(cb?: Callback<ContactAdded>): EventEmitter;
    ContactAdded(
      options?: EventOptions,
      cb?: Callback<ContactAdded>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "ContactAdded", cb: Callback<ContactAdded>): void;
  once(
    event: "ContactAdded",
    options: EventOptions,
    cb: Callback<ContactAdded>
  ): void;
}