import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { first, timestamp, map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
 // updateOnUser: any;
//  updateOnDisconnect: any;
  updateOnAway: any;
  // timestamp: any;

  constructor(private AFauth: AngularFireAuth, private router: Router,
    public db: AngularFireDatabase) {
      console.log('presence');
      this.updateOnUser().subscribe();
      this.updateOnDisconnect().subscribe();
      this.updateOnAway();
    }

    getPresence(uid: string) {
      return this.db.object('Users/${uid}').valueChanges();
    }

    getUser() {
      return this.AFauth.authState.pipe(first()).toPromise();
    }

    async setPresence(status: string) {
      const User = await this.getUser();
      if (User) {
        return this.db.object('Users/${user.uid}').update({ status, timestamp: this.timestamp});
    }
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  updateOnUser() {
    const con = this.db.object('Users/isOnline').valueChanges().pipe(
      map(isOnline => isOnline ? 'online' : 'offline')
    );
    return this.AFauth.authState.pipe(
      switchMap(user => user ? con : of('offline')),
      tap(status => this.setPresence(status))
    );
  }

  updateOnDisconnect() {
    return this.AFauth.authState.pipe(

    );
  }

}
