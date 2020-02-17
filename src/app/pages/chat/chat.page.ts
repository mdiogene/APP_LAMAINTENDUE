import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';
import {User} from '../../../models/User';
import {Observable, Subscription} from 'rxjs';
import {Platform, LoadingController} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ActionSheetController} from '@ionic/angular';
import {FileChooser} from '@ionic-native/file-chooser/ngx';
import {FilePath} from '@ionic-native/file-path/ngx';
import {File} from '@ionic-native/file/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {ViewChild} from '@angular/core';
import {IonContent} from '@ionic/angular';
import {RoleApilmtService} from '../../service/role-apilmt.service';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {Chat} from '../../../models/Chat';
import {finalize} from 'rxjs/operators';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {

<<<<<<< HEAD
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
      this.scrollToBottomOnInit();
=======
    @ViewChild('content') content: IonContent;

    text: string;
    chatRef: any;
    uid: string;
    userSubscription: Subscription;
    localUser = new User();
    users: User[] = [];
    usersSubscription: Subscription;
    actualUser = new User();
    localUserIsLogged = new User();
    userFromAPI = new UserAPILMT();
    platform: any;
    returnpath: string;
    uploadProgress: number;
    nativepath: any;
    firestore = firebase.storage();
    Ref: AngularFireStorageReference;
    task: AngularFireUploadTask;
    userFromAPISubscription: Subscription;
    mapEmailChat: Map<string, Chat> = new Map();
    mapEmailUser: Map<string, UserAPILMT> = new Map();
    usersAPILMTSubscription: Subscription;
    usersFromAPI: UserAPILMT[] = [];
    completeChats:  Map<string, Chat> = new Map();
    downloadURL: Observable<string>;
    urlTest: string;

    constructor(public af: AngularFireAuth,
                private authService: AuthService,
                public fs: AngularFirestore,
                public storage: AngularFireStorage,
                public LoadCtrl: LoadingController,
                public fc: FileChooser,
                public fp: FilePath,
                public platforme: Platform,
                public splashScreen: SplashScreen,
                private statusbar: StatusBar,
                private userAPILMTService: UserApilmtService,
                private roleAPILMTService: RoleApilmtService,
                public file: File) {
        //
        // this.uid = localStorage.getItem('uid')<<<<;
        // this.chatRef = this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
        // this.actualUser = this.getUserInfo(this.uid);
        //   this.Fbref = firebase.storage().ref();
        // this.getAllNamesAndChats(this.chatRef);
>>>>>>> chatsendfile
    }

<<<<<<< HEAD
  ionViewDidEnter() {
    this.content.scrollToBottom(-1);
  }

  scrollToBottomOnInit() {
    this.content.scrollToBottom(-1);

  }

  ngOnInit() {
    this.ionViewDidEnter();
    this.scrollToBottomOnInit();
    this.uid = localStorage.getItem('uid');
    this.chatRef =  this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
    this.actualUser = this.getUserInfo(this.uid);
=======
    getPhoto(event) {
        const id = Math.random().toString(36).substring(2);
        this.Ref = this.storage.ref(id);
        this.task = this.Ref.put(event.target.files[0]);
        this.task.snapshotChanges().pipe(
            finalize(() => (this.downloadURL = this.Ref.getDownloadURL()).subscribe(next => {
                this.urlTest = next;
                this.sendPicture(this.urlTest);
            }))
        ).subscribe();
        console.log(this.urlTest);

    }
>>>>>>> chatsendfile

    send() {
        if (this.text !== '') {
            this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
            console.log(this.af.auth.currentUser.uid);
            this.fs.collection('chats').add({
                Name: this.localUserIsLogged.prenom,
                Message: this.text,
                userId: this.af.auth.currentUser.uid,
                userEmail: this.af.auth.currentUser.email,
                Timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            this.text = '';
            this.content.scrollToBottom();
        }

    }

    sendPicture(downloadURL: string) {
            this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
            console.log(this.af.auth.currentUser.uid);
            this.fs.collection('chats').add({
                Name: this.localUserIsLogged.prenom,
                urlPicture: downloadURL,
                userId: this.af.auth.currentUser.uid,
                userEmail: this.af.auth.currentUser.email,
                Timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            this.content.scrollToBottom();
    }

<<<<<<< HEAD
    this.localUserIsLogged = this.authService.localUser;
  }
=======
    scrollToBottomOnInit() {
        this.content.scrollToBottom(300);
    }
>>>>>>> chatsendfile

    ngOnInit() {
        this.scrollToBottomOnInit();
        this.uid = localStorage.getItem('uid');
        // this.getUserConnectedWithAPILMT(this.uid);
        // console.log(this.uid);
        this.chatRef = this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
        // this.chatRef1 = this.fs.collection('chats').get();
        this.getAllChatMap(this.chatRef);

        console.log('get chat map from firebase');
        console.log(this.mapEmailChat);

        console.log('get user map from apilmt');
        console.log(this.mapEmailUser);

        console.log('all my chats');
        console.log(this.completeChats);


        this.userAPILMTService.getAllUsersAPILMT();

        this.actualUser = this.getUserInfo(this.uid);

        this.userSubscription = this.authService.userSubject.subscribe(
            (user: User) => {
                this.localUser = user;
                console.log(this.localUser);
            }
        );

        this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
            (user: UserAPILMT) => {
                this.userFromAPI = user;
            }
        );

        this.usersSubscription = this.authService.usersSubject.subscribe(
            (users: User[]) => {
                this.users = users;
            }
        );

        this.usersAPILMTSubscription = this.userAPILMTService.usersAPILMTSubject.subscribe(
            (usersAPILMT: UserAPILMT[]) => {
                this.usersFromAPI = usersAPILMT;
                this.usersFromAPI.forEach(userFromAPI => {
                    this.mapEmailUser.set(userFromAPI.email, userFromAPI);
                });
            }
        );

        this.authService.getAllUsers();
        this.getAllNamesAndChats(this.chatRef);

        this.localUserIsLogged = this.authService.localUser;
        this.content.scrollToBottom();
    }

    getAllChatMap(chatRef: any): void {
        chatRef.forEach((chat: any) => {
            const chatsecond = chat;
            chatsecond.forEach((champ: Chat) => {
                if (champ.Timestamp) {
                  //  this.userFromAPI = this.userAPILMTService.getUserByEmail(champ.userEmail);
                    this.mapEmailChat.set(champ.Timestamp, champ);
                }
            });
        });
    }

    getAllNamesAndChats(chatRef: any): void {
        chatRef.forEach((chat: any) => {
            const chatsecond = chat;
            chatsecond.forEach((champ: Chat) => {
                if (!champ.Name) {
                    champ.Name = this.mapEmailUser.get(champ.userEmail).prenom;
                    this.completeChats.set(champ.Timestamp, champ);
                } else {
                    this.completeChats.set(champ.Timestamp, champ);
                }
            });
        });
        console.log('name n existe pas');
        console.log(this.completeChats);
    }

    getUserConnectedWithAPILMT(userUID: string): void {
        this.userAPILMTService.getUserByFirebaseId(userUID);

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
