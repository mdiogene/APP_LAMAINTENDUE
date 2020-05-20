import {RestFullObject} from './RestFullObject';
import {Alimentaire} from './Alimentaire';
import {Vetement} from './Vetements';
import {Services} from './Services';
import {TypeBesoin} from './TypeBesoins';


export class BesoinsRemontes extends RestFullObject {

    typeBesoin: TypeBesoin;

    quantite: number;

    dateCreation: number;

    Description: string;

    alimentaire: Alimentaire;

    vetement: Vetement;

    service: Services;

    description: string;

    isOnUpdate: boolean;

    constructor(_links?: any) {
        super(_links);
    }
}
