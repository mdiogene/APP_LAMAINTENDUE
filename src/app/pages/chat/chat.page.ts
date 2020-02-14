import {Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';
import {User} from '../../../models/User';
import {Subscription} from 'rxjs';
import { Platform, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/file/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { ViewChild } from '@angular/core';
import { IonContent} from '@ionic/angular';
// import { Content } from '@angular/compiler/src/render3/r3_ast';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild('content') content: IonContent;
  /* public options = {
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
    mediaType: Camera.MediaType.ALLMEDIA,
    destinationType: Camera.DestinationType.FILE_URI
  };
  public Fbref: any; */
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
  uploadProgress: number;
  nativepath: any;
  firestore = firebase.storage();
  Ref: AngularFireStorageReference;
  task: AngularFireUploadTask;



  constructor(public af: AngularFireAuth,  private authService: AuthService, public fs: AngularFirestore,
    public storage: AngularFireStorage,
    public LoadCtrl: LoadingController, public fc: FileChooser, public fp: FilePath, public platforme: Platform,
    public splashScreen: SplashScreen, private statusbar: StatusBar, public file: File) {
    this.uid = localStorage.getItem('uid');

    this.chatRef =  this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.actualUser = this.getUserInfo(this.uid);
 //   this.Fbref = firebase.storage().ref();

  }

  getPhoto(event) {
    const id = Math.random().toString(36).substring(2);
    this.Ref = this.storage.ref(id);
    this.task = this.Ref.put(event.target.files[0]);
  }
 /* getPhoto() {
    Camera.getPicture(this.options).then(fileuri => {
      window.resolveLocalFileSystemURL('file://' + fileuri, FE => {
        FE.file((file: Blob) => {
          const FR = new FileReader();
          FR.onloadend = (res: any) => {
            const AF = res.target.result;
            const blob = new Blob([new Uint8Array(AF)], {type: 'video/mp4'});
            this.upload(blob);
          };
          FR.readAsArrayBuffer(file);
        });
      });
    });
  } */
 /* upload(blob: Blob) {
    this.Fbref.child('vid').put(blob);
   // this.firestore.ref('files/').child('vid').put(blob);
   alert('ok');
  }*/
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

  ionViewDidEnter() {
    this.content.scrollToBottom(-1);
  }

  ngOnInit() {
    this.ionViewDidEnter();
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


}
