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
  users: User[] = [];

  constructor(private AFauth: AngularFireAuth, private router: Router,
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
        this.localUser.isOnline = true;
        this.updateUser(this.localUser);
      }).catch(err => rejected(err));

    });

  }
// partie logout
  logout() {
    this.AFauth.auth.signOut().then(() => {
      this.localUser.isOnline = false;
      this.updateUser(this.localUser);
      this.router.navigate(['/']);
    });
  }

  emitUserByEmailSubject() {
    if (this.localUser) {
      this.userSubject.next(this.localUser);
//        console.log('Le print de userlocal est:' );
//        console.log( this.localUser );
    }
  }

  emitUsersSubject() {
    if (this.users) {
      this.usersSubject.next(this.users);
//        console.log('Le print de userlocal est:' );
//        console.log( this.localUser );
    }
  }
  /*getAllUsers(): void {
    this.fs.collection('Users').get()
        .subscribe(usersDoc => {
              usersDoc.forEach(doc => {
                if (!this.usersMap.has(doc.id)) {
                  this.usersMap.set(doc.id, <User>doc.data());
                  // this.users.unshift(<User>doc.data());
                }
              });
            },
            () => {
              console.log('Erreur de suppression' + error);
            });*/
   // console.log('Le print de users map est:' );
    // console.log( this.usersMap );

    getAllUsers(): void {
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
              });
    }

  updateUser(user?: User): void {

    this.fs.collection('Users').doc(user.userId)
        .set(Object.assign({ name: user.name, isOnline: user.isOnline, email: user.email, userId: user.userId,
          prenom: user.prenom, password: user.password, isAdmin: user.isAdmin, urlPicture: user.urlPicture}));
    this.users[this.users.indexOf(user)] = user;
    this.emitUsersSubject();

  }

  getUserByEmail(email: string) {
    if (this.usersMap.has(email)) {
      this.localUser = this.usersMap.get(email);
      this.userSubject.next(this.localUser);
      this.emitUserByEmailSubject();
     // console.log('Le print de userlocal est:' );
     // console.log( this.localUser );
    }
  }

  getUserByUserEmail(userEmail: string) {
    if (this.usersMap.has(userEmail)) {
      this.localUser = this.usersMap.get(userEmail);
      this.userSubject.next(this.localUser);
      this.emitUserByEmailSubject();
      console.log('Le print de userlocal est:' );
      console.log( this.localUser );
    }
  }
}
