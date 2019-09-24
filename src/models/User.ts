
export class User {
    id: number;
    userId: string ;
    name: string;
    prenom: string;
    email: string;
    password: string;
    isOnUpdate: boolean;
    isOnline: boolean;
    urlPicture: string;
    isAdmin: boolean;

    constructor(id?: number, userId?: string, name?: string, prenom?: string,
                email?: string, password?: string, urlPicture?: string,
                isOnline?: boolean, isAdmin?: boolean) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.isOnUpdate = false;
        this.isOnline = isOnline;
        this.urlPicture = urlPicture;
        this.isAdmin = isAdmin;
    }
}
