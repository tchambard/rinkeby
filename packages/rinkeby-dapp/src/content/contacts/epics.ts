import { Epic } from 'redux-observable';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootAction, RootState, Services } from 'rinkeby-types';

import { CREATE_CONTACT_ACTION, CONTACT_ADDED, IContact, LIST_CONTACTS_ACTION, ON_CONTACT_ADDED_ACTION } from './actions';
import { Contacts } from './contract';
import { Observable } from 'rxjs';

export const listContactsEpic: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(LIST_CONTACTS_ACTION.request)),
        mergeMap(async () => {

            const contacts: IContact[] = [];
           // const accounts = await web3.eth.requestAccounts();
            const contactList = new web3.eth.Contract(Contacts.abi, Contacts.address);

            const counter = await contactList.methods.count().call();

            for (var i = 1; i <= counter; i++) {
              const contact = await contactList.methods.contacts(i).call();
              contacts.push(contact);
            }
            return LIST_CONTACTS_ACTION.success(contacts);
        }),
        
    );
};

export const addContactEpic: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(CREATE_CONTACT_ACTION.request)),
        mergeMap(async (action) => {

            const { name, phone } = action.payload;
            const contactList = new web3.eth.Contract(Contacts.abi, Contacts.address);
            const accounts = await web3.eth.requestAccounts();
            const userAccount = accounts[0];

            try {
                await contactList.methods.createContact(name, phone).send({ from: userAccount })
                return CREATE_CONTACT_ACTION.success();
            } catch (e) {
                return CREATE_CONTACT_ACTION.failure(e.message);
            }
        }),
        
    );
};

export const onContactAddedEpic: Epic<RootAction, RootAction, RootState, Services> = (action$, state$, { web3 }) => {
    return action$.pipe(
        filter(isActionOf(ON_CONTACT_ADDED_ACTION.request)),
        switchMap(() => {
            
            const contactList = new web3.eth.Contract(Contacts.abi, Contacts.address);
            return new Observable<any>((obs) => {
                contactList.events.ContactAdded()
                    .on('data', async (evt) => {
                        const contact = await contactList.methods.contacts(evt.returnValues.id).call();
                        console.log('Contact created', contact)
                        obs.next({
                            id: contact.id,
                            name: contact.name,
                            phone: contact.phone,
                        });
                    });

                return () => (null);
            }).pipe(
                map((contact) => {
                    return CONTACT_ADDED(contact);
                }),
            );
        }),
    );
};
