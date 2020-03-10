import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {Maraude} from '../../../models/Maraude';
import {MaraudeService} from '../../service/maraude.service';
import {User} from '../../../models/User';
import {AuthService} from '../../service/auth.service';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {MaraudeUsersService} from '../../service/maraude-users.service';
import {MaraudeUsers} from '../../../models/MauraudeUsers';

@Component({
  selector: 'app-maraude',
  templateUrl: './maraude.page.html',
  styleUrls: ['./maraude.page.scss'],
})
export class MaraudePage implements OnInit {
  maraude = new Maraude();
  maraudes: Maraude[] = [];
  maraudesSubscription: Subscription;
  localUserIsLogged = new User();
  userFromAPISubscription: Subscription;
  userFromAPI = new UserAPILMT();
  maraudeUser = new MaraudeUsers();
  participate: boolean;
  vehicule: boolean;

  constructor(public af: AngularFireAuth,
              private maraudesAPILMTService: MaraudeService,
              private authService: AuthService,
              private userAPILMTService: UserApilmtService,
              private maraudeUserAPILMTService: MaraudeUsersService) { }

  ngOnInit() {
    this.maraudesSubscription = this.maraudesAPILMTService.maraudesSubject.subscribe(
        (maraudes: Maraude[]) => {
          console.log(maraudes);
          this.maraudes = maraudes;
          this.maraude = this.maraudes[this.maraudes.length - 1];
        }
    );


    this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
        (user: UserAPILMT) => {
          this.userFromAPI = user;
          console.log(user);
        }
    );

    this.localUserIsLogged = this.authService.localUser;
    this.maraudesAPILMTService.getAllMaraudes();

  }
  getUserConnectedWithAPILMT(userUID: string): void {
    this.userAPILMTService.getUserByFirebaseId(userUID);

  }

  sendPartipation(maraude: Maraude) {
    this.userFromAPI.vehicule = this.vehicule;
    this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
    this.maraudeUser.userFromAPI = this.userFromAPI;
    console.log('userFromAPI')
    console.log(this.af.auth.currentUser.uid)
    console.log('userFromAPI')
    console.log(this.userFromAPI)
    this.maraudeUser.maraude = maraude;
    this.maraudeUser.participate = this.participate;
    console.log('this.maraudeUser')
    console.log(this.maraudeUser);
    this.maraudeUserAPILMTService.addMaraudeUser(this.maraudeUser);
  }
}
