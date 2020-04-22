import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {AuthService} from '../../service/auth.service';
import {User} from '../../../models/User';
import {Observable, Subscription} from 'rxjs';
import {Platform, LoadingController} from '@ionic/angular';
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

                    this.userSubscription = this.authService.userSubject.subscribe(
                        (user: User) => {
                          this.localUser = user;
                        }
                    );
                    this.authService.getAllUsers();
                   // this.initializeApp();



        this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
            (user: UserAPILMT) => {
                this.userFromAPI = user;
            }
        );
    }

  ionViewDidEnter() {
    this.content.scrollToBottom(1);
  }


  scrollToBottomOnInit() {
    this.content.scrollToBottom(1);

  }
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
            this.ionViewDidEnter();

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
            this.ionViewDidEnter();
    }

    ngOnInit() {
        this.ionViewDidEnter();
        this.scrollToBottomOnInit();
        this.uid = localStorage.getItem('uid');
        // this.getUserConnectedWithAPILMT(this.uid);
        // console.log(this.uid);
        this.chatRef = this.fs.collection('chats', ref => ref.orderBy('Timestamp')).valueChanges();
        this.getAllChatMap(this.chatRef);

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


        console.log('user local');
        console.log(this.localUser);
        console.log('user from api');
        console.log(this.userFromAPI);

        this.authService.getAllUsers();
        this.getAllNamesAndChats(this.chatRef);
        this.localUserIsLogged = this.authService.localUser;
        this.content.scrollToBottom();

        console.log('apres, user local');
        console.log(this.localUser);
        console.log('apres, user from api');
        console.log(this.userFromAPI);
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
