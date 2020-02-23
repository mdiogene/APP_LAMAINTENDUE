
export class User {
    id: number;
    name: string;
    prenom: string;
    email: string;
    password: string;
    isOnUpdate: boolean;
    isOnline: boolean;
    urlPicture: string;
    isAdmin: boolean;
    userId: string;
    vehicule: boolean;

    constructor(id?: number,
                name?: string,
                prenom?: string,
                email?: string,
                password?: string,
                urlPicture?: string,
                isAdmin?: boolean,
                userId?: string,
                isOnline?: boolean,
                vehicule?: boolean) {
        this.id = id;
        this.name = name;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.isOnUpdate = false;
        this.isOnline = isOnline;
        this.urlPicture = urlPicture;
        this.isAdmin = isAdmin;
        this.userId = userId;
        this.vehicule = vehicule;
    }
}


