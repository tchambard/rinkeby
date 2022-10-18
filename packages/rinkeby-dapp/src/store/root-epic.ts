import { combineEpics } from 'redux-observable';

import * as contactsEpics from '../content/contacts/epics';
import * as votingEpics from '../content/voting/epics';

export default combineEpics(
    ...Object.values(contactsEpics),
    ...Object.values(votingEpics),
);
