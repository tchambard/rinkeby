import { routerActions } from 'connected-react-router';

import * as contactsActions from '../content/contacts/actions';
import * as votingActions from '../content/voting/actions';

export default {
    router: routerActions,
    contacts: contactsActions,
    voting: votingActions,
};
