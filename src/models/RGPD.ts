import {RestFullObject} from './RestFullObject';
import {UserAPILMT} from './UserAPILMT';

export class RGPD extends RestFullObject {
    user: UserAPILMT;
    aconfirme: boolean;
    arefuse: boolean;

    constructor(_links?: any) {
        super(_links);
    }
}
