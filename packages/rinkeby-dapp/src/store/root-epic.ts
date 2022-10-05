import { combineEpics } from 'redux-observable';

import * as contactsEpics from '../content/contacts/epics';

export default combineEpics(
    ...Object.values(contactsEpics),
);
