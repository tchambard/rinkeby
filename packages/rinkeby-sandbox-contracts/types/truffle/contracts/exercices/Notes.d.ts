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

type AllEvents = OwnershipTransferred;

export interface NotesInstance extends Truffle.ContractInstance {
  addNote: {
    (
      _studentName: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _studentName: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _studentName: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _studentName: string,
      _note: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

  getGlobalAverage(txDetails?: Truffle.TransactionDetails): Promise<BN>;

  getGlobalSubjectAverage(
    _subject: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getNote(
    _studentName: string,
    _subject: number | BN | string,
    _noteIndex: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getStudentAverage(
    _studentName: string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  getStudentSubjectAverage(
    _studentName: string,
    _subject: number | BN | string,
    txDetails?: Truffle.TransactionDetails
  ): Promise<BN>;

  owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

  registerTeacher: {
    (
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<number>;
  };

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
      _studentName: string,
      _note: number | BN | string,
      _noteIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<Truffle.TransactionResponse<AllEvents>>;
    call(
      _studentName: string,
      _note: number | BN | string,
      _noteIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<void>;
    sendTransaction(
      _studentName: string,
      _note: number | BN | string,
      _noteIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<string>;
    estimateGas(
      _studentName: string,
      _note: number | BN | string,
      _noteIndex: number | BN | string,
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
    addNote: {
      (
        _studentName: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _studentName: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _studentName: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _studentName: string,
        _note: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

    getGlobalAverage(txDetails?: Truffle.TransactionDetails): Promise<BN>;

    getGlobalSubjectAverage(
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getNote(
      _studentName: string,
      _subject: number | BN | string,
      _noteIndex: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getStudentAverage(
      _studentName: string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    getStudentSubjectAverage(
      _studentName: string,
      _subject: number | BN | string,
      txDetails?: Truffle.TransactionDetails
    ): Promise<BN>;

    owner(txDetails?: Truffle.TransactionDetails): Promise<string>;

    registerTeacher: {
      (
        _subject: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _subject: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _subject: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _subject: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<number>;
    };

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
        _studentName: string,
        _note: number | BN | string,
        _noteIndex: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<Truffle.TransactionResponse<AllEvents>>;
      call(
        _studentName: string,
        _note: number | BN | string,
        _noteIndex: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<void>;
      sendTransaction(
        _studentName: string,
        _note: number | BN | string,
        _noteIndex: number | BN | string,
        txDetails?: Truffle.TransactionDetails
      ): Promise<string>;
      estimateGas(
        _studentName: string,
        _note: number | BN | string,
        _noteIndex: number | BN | string,
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