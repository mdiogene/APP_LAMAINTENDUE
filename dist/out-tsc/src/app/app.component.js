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
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { User } from '../models/User';
import { AuthService } from './service/auth.service';
var AppComponent = /** @class */ (function () {
    // localUserIsLogged = new User();
    function AppComponent(platform, splashScreen, statusBar, navCtrl, authService) {
        var _this = this;
        this.platform = platform;
        this.splashScreen = splashScreen;
        this.statusBar = statusBar;
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.localUser = new User();
        this.appPages = [
            {
                title: 'Home',
                url: '/home-results',
                direct: 'root',
                icon: 'home'
            },
            {
                title: 'lmt chat',
                url: '/chat',
                direct: 'forward',
                icon: 'chatbubbles'
            },
            {
                title: 'Calendar',
                url: '/calendar',
                direct: 'forward',
                icon: 'calendar'
            },
            {
                title: 'besoin',
                url: '/besoin',
                direct: 'forward',
                icon: 'basket'
            },
            {
                title: 'lmt Geolok',
                url: '/geoloc',
                direct: 'forward',
                icon: 'locate',
            },
            {
                title: 'Urence',
                url: '/urgence',
                direct: 'forward',
                icon: 'warning',
            },
        ];
        this.userSubscription = this.authService.userSubject.subscribe(function (user) {
            _this.localUser = user;
        });
        this.authService.getAllUsers();
        this.initializeApp();
    }
    AppComponent.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        }).catch(function () { });
    };
    AppComponent.prototype.goToEditProgile = function () {
        this.navCtrl.navigateForward('edit-profile');
    };
    AppComponent.prototype.Onlogout = function () {
        this.navCtrl.navigateRoot('/');
        // tslint:disable-next-line:no-unused-expression
        this.authService.logout();
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
            styleUrls: ['./app.component.scss']
        }),
        __metadata("design:paramtypes", [Platform,
            SplashScreen,
            StatusBar,
            NavController,
            AuthService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map