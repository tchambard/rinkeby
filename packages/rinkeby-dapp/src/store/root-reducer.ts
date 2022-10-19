import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

import ethNetwork from '../eth-network/reducer';
import voting from '../content/voting/reducer';

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    ethNetwork,
    voting,
});

export default createRootReducer;
