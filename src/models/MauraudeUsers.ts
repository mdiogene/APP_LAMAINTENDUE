import {RestFullObject} from './RestFullObject';

import {Maraude} from './Maraude';
import {UserAPILMT} from './UserAPILMT';

export class MaraudeUsers extends RestFullObject {
    user: UserAPILMT;
    maraude: Maraude;
    participate: boolean;
    isOnUpdate: boolean;
    constructor(_links?: any) {
        super(_links);
    }
}
