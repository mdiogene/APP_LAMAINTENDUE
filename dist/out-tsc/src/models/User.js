var User = /** @class */ (function () {
    function User(id, name, prenom, email, password, urlPicture, isAdmin, userId, isOnline) {
        this.id = id;
        this.name = name;
        this.prenom = prenom;
        this.email = email;
        this.password = password;
        this.isOnUpdate = false;
        this.isOnline = isOnline;
        this.urlPicture = urlPicture;
        this.isAdmin = isAdmin;
        this.userId = userId;
    }
    return User;
}());
export { User };
//# sourceMappingURL=User.js.map