import { combineEpics } from 'redux-observable';

import * as ethNetworkEpics from '../eth-network/epics';
import * as votingEpics from '../content/voting/epics';

export default combineEpics(
    ...Object.values(ethNetworkEpics),
    ...Object.values(votingEpics),
);
