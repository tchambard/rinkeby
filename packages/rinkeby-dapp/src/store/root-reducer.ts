import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import contacts from '../content/contacts/reducer';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    contacts,
});

export default createRootReducer;
