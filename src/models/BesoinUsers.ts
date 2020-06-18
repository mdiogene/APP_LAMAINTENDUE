import {RestFullObject} from './RestFullObject';

import {UserAPILMT} from './UserAPILMT';
import {BesoinsRemontes} from './BesoinsRemontes';

export class BesoinUsers extends RestFullObject {
    user: UserAPILMT;
    besoinsRemontes: BesoinsRemontes;
    quantite: number;
    participate: boolean;
    isOnUpdate: boolean;
    constructor(_links?: any) {
        super(_links);
    }
}
