import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {User} from '../../models/User';
import {Subject} from 'rxjs';
import {error} from 'util';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  localUser: User;
  userSubject = new Subject<User>();
  usersMap: Map<string, User> = new Map();
  usersSubject = new Subject< User[]>();
  usersMapConnectedSubject = new Subject<Map<string, User>>();
  users: User[] = [];
  localUserLogged = new User();
  usersMapConnected: Map<string, User> = new Map();


  constructor(public AFauth: AngularFireAuth,
              private router: Router,
              public fs: AngularFirestore) {
  }

  // Partie Login
  login(email: string, password: string) {
    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
        this.getAllUsers();
        this.getUserByUserEmail(user.user.email);
        this.emitUserByEmailSubject();
        this.updateUser(this.localUser);
        this.setUser(this.localUser);
      }).catch(err => rejected(err));

    });

  }
// partie logout
  logout() {
    this.AFauth.auth.signOut().then(() => {
      this.localUser.isOnline = false;
      this.updateUser(this.localUser);
      this.setUser(this.localUser);
      this.router.navigate(['/']);
    });
  }

  // reset password
  resetPass(email: string) {
    return this.AFauth.auth.sendPasswordResetEmail(email);
  }

  emitUserByEmailSubject() {
    if (this.localUser) {
      this.userSubject.next(this.localUser);
    }
  }


  emitUsersSubject() {
    if (this.users) {
      this.usersSubject.next(this.users);
    }
  }

  emitUsersMapSubject() {
    if (this.usersMapConnected) {
      this.usersMapConnectedSubject.next(this.usersMapConnected);
    }
  }

  getAllUsers(): void {
    this.fs.collection('Users').get()
        .subscribe(usersDoc => {
              usersDoc.forEach(doc => {

                let user: User;
                user = <User>doc.data();
                if (!this.usersMap.has(user.email)) {
                  this.usersMap.set(user.email, <User>doc.data());
                  this.users.unshift(<User>doc.data());
                }
              });
              this.emitUsersSubject();
            },
            () => {
              console.log('Erreur' + error);
            });
  }

  updateUser(user?: User): void {

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


  }

  getUserByUserEmail(userEmail: string) {
    if (this.usersMap.has(userEmail)) {
      this.localUser = this.usersMap.get(userEmail);
      this.userSubject.next(this.localUser);
      this.emitUserByEmailSubject();
    }
  }

  setUser(user: User) {
    this.localUserLogged = user;
  }
}
