import { routerActions } from 'connected-react-router';

import * as ethNetworkActions from '../eth-network/actions';
import * as votingActions from '../content/voting/actions';

export default {
    router: routerActions,
    eth: ethNetworkActions,
    voting: votingActions,
};
