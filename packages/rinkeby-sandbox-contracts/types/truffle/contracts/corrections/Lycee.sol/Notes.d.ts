/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { EventData, PastEventOptions } from "web3-eth-contract";

export interface NotesContract extends Truffle.Contract<NotesInstance> {
  "new"(meta?: Truffle.TransactionDetails): Promise<NotesInstance>;
}

export interface OwnershipTransferred {
  name: "OwnershipTransferred";
  args: {
    previousOwner: string;
    newOwner: string;
    0: string;
    1: string;
  };
}

export interface studentAdded {
  name: "studentAdded";
  args: {
    _name: string;
    _class: string;
    _addr: string;
    0: string;
    1: string;
    2: string;
  };
}

export interface teacherAdded {
  name: "teacherAdded";
  args: {
    _class: string;
    _course: string;
    _addr: string;
    0: string;
    1: string;
    2: string;
  };
}

type AllEvents = OwnershipTransferred | studentAdded | teacherAdded;

export interface NotesInstance extends Truffle.ContractInstance {
  addStudent: {
    (
      _name: string,
      _class: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _name: string,
      _class: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _name: string,
      _class: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _name: string,
      _class: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  calculateMoyenneGenerale(
    _class: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  calculateMoyennePerCourse(
    _class: string,
    _course: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  calculateMoyenneStudent(
    _name: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  isPassing(
    _name: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<boolean>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  renounceOwnership: {
    (txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(txDetails?: Truffle.TransactionDetails): Promise<void>;
    sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
    estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
  };

  setNote: {
    (
      _course: string,
      _nameStudent: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _course: string,
      _nameStudent: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _course: string,
      _nameStudent: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _course: string,
      _nameStudent: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  setTeacher: {
    (
      _class: string,
      _course: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _class: string,
      _course: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _class: string,
      _course: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _class: string,
      _course: string,
      _addr: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  transferOwnership: {
    (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
      Truffle.TransactionResponse<AllEvents>
    >;
    call(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      newOwner: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  methods: {
    addStudent: {
      (
        _name: string,
        _class: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _name: string,
        _class: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _name: string,
        _class: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _name: string,
        _class: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    calculateMoyenneGenerale(
      _class: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    calculateMoyennePerCourse(
      _class: string,
      _course: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    calculateMoyenneStudent(
      _name: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    isPassing(
      _name: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<boolean>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    renounceOwnership: {
      (txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(txDetails?: Truffle.TransactionDetails): Promise<void>;
      sendTransaction(txDetails?: Truffle.TransactionDetails): Promise<string>;
      estimateGas(txDetails?: Truffle.TransactionDetails): Promise<number>;
    };

    setNote: {
      (
        _course: string,
        _nameStudent: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _course: string,
        _nameStudent: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _course: string,
        _nameStudent: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _course: string,
        _nameStudent: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    setTeacher: {
      (
        _class: string,
        _course: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _class: string,
        _course: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _class: string,
        _course: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _class: string,
        _course: string,
        _addr: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    transferOwnership: {
      (newOwner: string, txDetails?: Truffle.TransactionDetails): Promise<
        Truffle.TransactionResponse<AllEvents>
      >;
      call(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        newOwner: string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };
  };

  getPastEvents(event: string): Promise<EventData[]>;
  getPastEvents(
    event: string,
    options: PastEventOptions,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
  getPastEvents(event: string, options: PastEventOptions): Promise<EventData[]>;
  getPastEvents(
    event: string,
    callback: (error: Error, event: EventData) => void
  ): Promise<EventData[]>;
}
