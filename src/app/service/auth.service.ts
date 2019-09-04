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

  constructor(private AFauth: AngularFireAuth, private router: Router,
              public fs: AngularFirestore) {
  }

  // Partie Login
  login(email: string, password: string) {

    return new Promise((resolve, rejected) => {
      this.AFauth.auth.signInWithEmailAndPassword(email, password).then(user => {
        resolve(user);
        this.getAllUsers();
        this.getUserByEmail(email);
  //      console.log('dans local service user etait :');
  //    console.log(this.localUser);
      }).catch(err => rejected(err));

    });

  }
// partie logout
  logout() {
    this.AFauth.auth.signOut().then(() => {
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

  getUserByEmail(email: string) {
    if (this.usersMap.has(email)) {
      this.localUser = this.usersMap.get(email);
      this.userSubject.next(this.localUser);
      this.emitUserByEmailSubject();
     // console.log('Le print de userlocal est:' );
     // console.log( this.localUser );
    }
  }
}
