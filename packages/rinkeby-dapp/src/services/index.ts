import { ClientFactory } from './ClientFactory';
import * as logger from './logger-service';

export default {
    logger,
    web3: ClientFactory.web3(),
};
