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
var ChatPage = /** @class */ (function () {
    function ChatPage(af, fs) {
        this.af = af;
        this.fs = fs;
        this.uid = localStorage.getItem('userid');
        this.chatRef = this.fs.collection('chats', function (ref) { return ref.orderBy('Timestamp'); }).valueChanges();
        // ).valueChanges();
    }
    ChatPage.prototype.send = function () {
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
    };
    ChatPage.prototype.ngOnInit = function () {
    };
    ChatPage = __decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.page.html',
            styleUrls: ['./chat.page.scss'],
        }),
        __metadata("design:paramtypes", [AngularFireAuth, AngularFirestore])
    ], ChatPage);
    return ChatPage;
}());
export { ChatPage };
//# sourceMappingURL=chat.page.js.map