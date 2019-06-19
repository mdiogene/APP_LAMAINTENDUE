import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { send } from 'q';
import * as firebase from 'firebase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  text: string;
  chatRef: any;
  uid: string;

  constructor(public af: AngularFireAuth, public fs: AngularFirestore) {
    this.uid = localStorage.getItem('userid');
    this.chatRef =  this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
   // ).valueChanges();
  }
  send() {
    // tslint:disable-next-line:triple-equals
    if (this.text != '') {
      this.fs.collection('chats').add({
        Name: this.af.auth.currentUser.displayName,
        Message: this.text,
        userid: this.af.auth.currentUser.uid,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
       this.text = '';
    }
  }

  ngOnInit() {
  }

}
