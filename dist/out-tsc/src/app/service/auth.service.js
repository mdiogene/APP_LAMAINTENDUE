var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../models/User';
import { Subject } from 'rxjs';
import { error } from 'util';
import { AngularFirestore } from '@angular/fire/firestore';
var AuthService = /** @class */ (function () {
    function AuthService(AFauth, router, fs) {
        this.AFauth = AFauth;
        this.router = router;
        this.fs = fs;
        this.userSubject = new Subject();
        this.usersMap = new Map();
        this.usersSubject = new Subject();
        this.users = [];
        this.localUserLogged = new User();
    }
    // Partie Login
    AuthService.prototype.login = function (email, password) {
        var _this = this;
        return new Promise(function (resolve, rejected) {
            _this.AFauth.auth.signInWithEmailAndPassword(email, password).then(function (user) {
                resolve(user);
                _this.getAllUsers();
                _this.getUserByUserEmail(user.user.email);
                _this.emitUserByEmailSubject();
                _this.localUser.isOnline = true;
                _this.updateUser(_this.localUser);
                _this.setUser(_this.localUser);
                console.log('login: local user logged');
                console.log(_this.localUser);
            }).catch(function (err) { return rejected(err); });
        });
    };
    // partie logout
    AuthService.prototype.logout = function () {
        var _this = this;
        this.AFauth.auth.signOut().then(function () {
            _this.localUser.isOnline = false;
            _this.updateUser(_this.localUser);
            _this.setUser(_this.localUser);
            _this.router.navigate(['/']);
        });
    };
    AuthService.prototype.emitUserByEmailSubject = function () {
        if (this.localUser) {
            this.userSubject.next(this.localUser);
        }
    };
    AuthService.prototype.emitUsersSubject = function () {
        if (this.users) {
            this.usersSubject.next(this.users);
        }
    };
    AuthService.prototype.getAllUsers = function () {
        var _this = this;
        this.fs.collection('Users').get()
            .subscribe(function (usersDoc) {
            usersDoc.forEach(function (doc) {
                var user;
                user = doc.data();
                if (!_this.usersMap.has(user.email)) {
                    _this.usersMap.set(user.email, doc.data());
                    _this.users.unshift(doc.data());
                }
            });
            _this.emitUsersSubject();
        }, function () {
            console.log('Erreur' + error);
        });
    };
    AuthService.prototype.updateUser = function (user) {
        this.fs.collection('Users').doc(user.userId)
            .set(Object.assign({
            name: user.name, isOnline: user.isOnline, email: user.email, userId: user.userId,
            prenom: user.prenom, password: user.password, isAdmin: user.isAdmin, urlPicture: user.urlPicture
        }));
        this.users[this.users.indexOf(user)] = user;
        this.emitUsersSubject();
        /*  getAllUsers(): void {
            this.fs.collection('Users').get()
                .subscribe(usersDoc => {
                      usersDoc.forEach(doc => {
                        let user: User;
                        user = <User>doc.data();
                        if (!this.usersMap.has(user.email)) {
                          this.usersMap.set(user.email, <User>doc.data());
                        }
                      });
                    },
                    () => {
                      console.log('Erreur' + error);
                    })
        };*/
    };
    AuthService.prototype.getUserByUserEmail = function (userEmail) {
        if (this.usersMap.has(userEmail)) {
            this.localUser = this.usersMap.get(userEmail);
            this.userSubject.next(this.localUser);
            this.emitUserByEmailSubject();
        }
    };
    AuthService.prototype.setUser = function (user) {
        this.localUserLogged = user;
    };
    AuthService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [AngularFireAuth,
            Router,
            AngularFirestore])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map