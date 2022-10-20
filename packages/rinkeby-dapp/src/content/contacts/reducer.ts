import { combineReducers } from 'redux';
import { ActionType, createReducer } from 'typesafe-actions';

import { CREATE_CONTACT_ACTION, CONTACT_ADDED, IContact, LIST_CONTACTS_ACTION, CLEAR_CREATE_CONTACT_TX_ERROR } from './actions';

export interface IState {
    contacts: IContact[];
    createTxPending: boolean;
    createTxError?: string;
}

const initialState: IState = {
    contacts: [],
    createTxPending: false,
};

export default createReducer(initialState)
    .handleAction([LIST_CONTACTS_ACTION.request],
        (state: IState): IState => {
            return {
                ...state,
                contacts: [],
            };
        })

    .handleAction([LIST_CONTACTS_ACTION.failure],
        (state: IState): IState => {
            return {
                ...state,
            };
        })

    .handleAction([LIST_CONTACTS_ACTION.success],
        (state: IState, action: ActionType<typeof LIST_CONTACTS_ACTION.success>): IState => {
            return {
                ...state,
                contacts: action.payload,
            };
        })

    .handleAction([CREATE_CONTACT_ACTION.request],
        (state: IState): IState => {
            return {
                ...state,
                createTxPending: true,
                createTxError: undefined,
            };
        })

    .handleAction([CREATE_CONTACT_ACTION.failure],
        (state: IState, action: ActionType<typeof CREATE_CONTACT_ACTION.failure>): IState => {
            return {
                ...state,
                createTxPending: false,
                createTxError: action.payload,
            };
        })

    .handleAction([CREATE_CONTACT_ACTION.success],
        (state: IState): IState => {
            return {
                ...state,
                createTxPending: false,
            };
        })

    .handleAction([CONTACT_ADDED],
        (state: IState, action: ActionType<typeof CONTACT_ADDED>): IState => {
            return {
                ...state,
                contacts: [
                    ...state.contacts,
                    action.payload,
                ],
            };
        })

    .handleAction([CLEAR_CREATE_CONTACT_TX_ERROR],
        (state: IState, action: ActionType<typeof CLEAR_CREATE_CONTACT_TX_ERROR>): IState => {
            return {
                ...state,
                createTxError: undefined,
            };
        });
