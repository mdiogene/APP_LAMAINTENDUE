import {Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';
import {User} from '../../../models/User';
import {Subscription} from 'rxjs';
import { Platform, LoadingController } from '@ionic/angular';
import {ShareimgService} from '../../service/shareimg.service';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  text: string;
  chatRef: any;
  uid: string;
  userSubscription: Subscription;
  localUser = new User();
  users: User[] = [];
  usersSubscription: Subscription;
  actualUser = new User();
  localUserIsLogged = new User();
  platform: any;
  returnpath: string;

  constructor(public af: AngularFireAuth,  private authService: AuthService, public fs: AngularFirestore,
    public LoadCtrl: LoadingController, public fc: FileChooser, public fp: FilePath) {
    this.uid = localStorage.getItem('uid');

    this.chatRef =  this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.actualUser = this.getUserInfo(this.uid);

  }
  send() {
    if (this.text !== '') {
      this.fs.collection('chats').add({
        Name: this.af.auth.currentUser.displayName,
        Message: this.text,
        userId: this.af.auth.currentUser.uid,
        userEmail : this.af.auth.currentUser.email,
        Timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      this.text = '';
    }
  }


  ngOnInit() {

    this.uid = localStorage.getItem('uid');
    this.chatRef =  this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.actualUser = this.getUserInfo(this.uid);

    this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.localUser = user;
        }
    );

    this.usersSubscription = this.authService.usersSubject.subscribe(
        (users: User[]) => {
          this.users = users;
        }
    );

    this.authService.getAllUsers();

    this.localUserIsLogged = this.authService.localUser;
  }

  getUserInfo(userId: string): User {
    this.authService.getAllUsers();
    this.actualUser = this.authService.usersMap.get(userId);
    return this.actualUser;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.usersSubscription.unsubscribe();
  }


  selectImage() {
    this.fc.open().then((fileuri) => {
      this.fp.resolveNativePath(fileuri).then((resolvednativepath) => {
        this.returnpath = resolvednativepath;
      });
    });
  }

/*upload() {
   const loader = this.LoadCtrl.create({
      message: 'Loading'
    });
    loader.then((loadingElement) => {
      loadingElement.present();
});
this.imageService.picmsgstore().then((url) => {
  // const Ref = this;
   setTimeout(function() {
     this.LoadCtrl.dismiss();
   }, 5000);

   this.text = '';

});
}*/


}
