import {RestFullObject} from './RestFullObject';

import {UserAPILMT} from './UserAPILMT';
import {BesoinsRemontes} from './BesoinsRemontes';

export class BesoinUsers extends RestFullObject {
    user: UserAPILMT;
    besoin: BesoinsRemontes;
    participate: boolean;
    isOnUpdate: boolean;
    constructor(_links?: any) {
        super(_links);
    }
}
