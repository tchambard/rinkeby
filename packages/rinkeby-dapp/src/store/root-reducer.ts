import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import contacts from '../content/contacts/reducer';
import voting from '../content/voting/reducer';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    contacts,
    voting,
});

export default createRootReducer;
