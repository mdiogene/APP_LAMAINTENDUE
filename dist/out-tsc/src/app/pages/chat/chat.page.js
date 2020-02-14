var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { AuthService } from '../../service/auth.service';
import { User } from '../../../models/User';
import { Platform, LoadingController } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
// import { Content } from '@angular/compiler/src/render3/r3_ast';
var ChatPage = /** @class */ (function () {
    function ChatPage(af, authService, fs, storage, LoadCtrl, fc, fp, platforme, splashScreen, statusbar, file) {
        this.af = af;
        this.authService = authService;
        this.fs = fs;
        this.storage = storage;
        this.LoadCtrl = LoadCtrl;
        this.fc = fc;
        this.fp = fp;
        this.platforme = platforme;
        this.splashScreen = splashScreen;
        this.statusbar = statusbar;
        this.file = file;
        this.localUser = new User();
        this.users = [];
        this.actualUser = new User();
        this.localUserIsLogged = new User();
        this.firestore = firebase.storage();
        this.uid = localStorage.getItem('uid');
        this.chatRef = this.fs.collection('chats', function (ref) { return ref.orderBy('Timestamp'); }).valueChanges();
        this.actualUser = this.getUserInfo(this.uid);
        //   this.Fbref = firebase.storage().ref();
    }
    ChatPage.prototype.getPhoto = function (event) {
        var id = Math.random().toString(36).substring(2);
        this.Ref = this.storage.ref(id);
        this.task = this.Ref.put(event.target.files[0]);
    };
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
    ChatPage.prototype.send = function () {
        if (this.text !== '') {
            this.fs.collection('chats').add({
                Name: this.af.auth.currentUser.displayName,
                Message: this.text,
                userId: this.af.auth.currentUser.uid,
                userEmail: this.af.auth.currentUser.email,
                Timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            this.text = '';
            this.scrollToBottomOnInit();
        }
    };
    ChatPage.prototype.ionViewDidEnter = function () {
        this.content.scrollToBottom(-1);
    };
    ChatPage.prototype.scrollToBottomOnInit = function () {
        this.content.scrollToBottom(-1);
    };
    ChatPage.prototype.ngOnInit = function () {
        var _this = this;
        this.ionViewDidEnter();
        this.scrollToBottomOnInit();
        this.uid = localStorage.getItem('uid');
        this.chatRef = this.fs.collection('chats', function (ref) { return ref.orderBy('Timestamp'); }).valueChanges();
        this.actualUser = this.getUserInfo(this.uid);
        this.userSubscription = this.authService.userSubject.subscribe(function (user) {
            _this.localUser = user;
        });
        this.usersSubscription = this.authService.usersSubject.subscribe(function (users) {
            _this.users = users;
        });
        this.authService.getAllUsers();
        this.localUserIsLogged = this.authService.localUser;
    };
    ChatPage.prototype.getUserInfo = function (userId) {
        this.authService.getAllUsers();
        this.actualUser = this.authService.usersMap.get(userId);
        return this.actualUser;
    };
    ChatPage.prototype.ngOnDestroy = function () {
        this.userSubscription.unsubscribe();
        this.usersSubscription.unsubscribe();
    };
    __decorate([
        ViewChild('content'),
        __metadata("design:type", IonContent)
    ], ChatPage.prototype, "content", void 0);
    ChatPage = __decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.page.html',
            styleUrls: ['./chat.page.scss'],
        }),
        __metadata("design:paramtypes", [AngularFireAuth, AuthService, AngularFirestore,
            AngularFireStorage,
            LoadingController, FileChooser, FilePath, Platform,
            SplashScreen, StatusBar, File])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.page.js.map