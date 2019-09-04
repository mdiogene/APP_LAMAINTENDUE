import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import {Subscription} from 'rxjs';
import {User} from '../models/User';
import {AuthService} from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public appPages: Array<Pages>;
  userSubscription: Subscription;
  localUser = new User();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private authService: AuthService,
  ) {
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
        title: 'lmt Geolok',
        url: '/geoloc',
        direct: 'forward',
        icon: 'locate',
      },

     /* {
        title: 'App Settings',
        url: '/settings',
        direct: 'forward',
        icon: 'cog'
      }*/
    ];

    this.userSubscription = this.authService.userSubject.subscribe(
        (user: User) => {
          this.localUser = user;
        }
    );

    this.authService.getAllUsers();
console.log(this.localUser);
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward('edit-profile');
  }

  Onlogout() {
    this.navCtrl.navigateRoot('/');
      // tslint:disable-next-line:no-unused-expression
      this.authService.logout();
  }

}
