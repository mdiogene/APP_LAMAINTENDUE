import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { first, map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import {of, Subject} from 'rxjs';
import {User} from '../../models/User';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  localUser: User;
  userLoggedSubject = new Subject<User>();
  // updateOnAway: any;
  // timestamp: any;

  constructor(private AFauth: AngularFireAuth) {
    //   console.log('presence');
    //   this.updateOnUser().subscribe();
    //   this.updateOnDisconnect().subscribe();
    //   this.updateOnAway();
    }
  emitUserLoggedInSubject() {
    if (this.localUser) {
      this.userLoggedSubject.next(this.localUser);
      console.log('Le print de userlocal est:' );
      console.log( this.localUser );
    }
  }
  //   getPresence(uid: string) {
  //     return this.db.object('Users/${uid}').valueChanges();
  //   }
  //
  // getUser(user: User) {
  //   return this.AFauth.authState.pipe(first()).toPromise();
  // }

    setUser(user: User): User {
     this.localUser = user;
     // this.emitUserLoggedInSubject();
      return this.localUser;
  }

    // async setPresence(status: string) {
    //  // const User = await this.getUser();
    //   if (User) {
    //     return this.db.object('Users/${user.uid}').update({ status, timestamp: this.timestamp});
    // }
  }

  // get timestamp() {
  //   return firebase.database.ServerValue.TIMESTAMP;
  // }
  //
  // updateOnUser() {
  //   const con = this.db.object('Users/isOnline').valueChanges().pipe(
  //     map(isOnline => isOnline ? 'online' : 'offline')
  //   );
  //   return this.AFauth.authState.pipe(
  //     switchMap(user => user ? con : of('offline')),
  //     tap(status => this.setPresence(status))
  //   );
 // }

  // updateOnDisconnect() {
  //   return this.AFauth.authState.pipe(
  //
  //   );
  // }

// }
