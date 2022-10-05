import { createAction, createAsyncAction } from 'typesafe-actions';

export interface IContactForm {
    name: string;
    phone: string;
}
export interface IContact {
    id: number;
    name: string;
    phone: string;
}

export const LIST_CONTACTS_ACTION = createAsyncAction(
    'LIST_CONTACTS_ACTION_REQUEST',
    'LIST_CONTACTS_ACTION_SUCCESS',
    'LIST_CONTACTS_ACTION_FAILURE',
)<void, IContact[], string>();

export const CREATE_CONTACT_ACTION = createAsyncAction(
    'CREATE_CONTACT_ACTION_REQUEST',
    'CREATE_CONTACT_ACTION_SUCCESS',
    'CREATE_CONTACT_ACTION_FAILURE',
)<IContactForm, void, string>();

export const ON_CONTACT_ADDED_ACTION = createAsyncAction(
    'ON_CONTACT_ADDED_ACTION_REQUEST',
    'ON_CONTACT_ADDED_ACTION_SUCCESS',
    'ON_CONTACT_ADDED_ACTION_FAILURE',
)<void, string, string>();

export const CONTACT_ADDED = createAction('ADD_CONTACT', (action) => {
    return (contact: IContact) => action(contact);
});

export const CLEAR_CREATE_CONTACT_TX_ERROR = createAction('CLEAR_CREATE_CONTACT_TX_ERROR', (action) => {
    return () => action();
});