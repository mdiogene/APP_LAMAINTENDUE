import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {RgpdService} from '../../service/rgpd.service';
import {RGPD} from '../../../models/RGPD';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {BesoinsRemontes} from '../../../models/BesoinsRemontes';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-rgpd',
  templateUrl: './rgpd.page.html',
  styleUrls: ['./rgpd.page.scss'],
})
export class RgpdPage implements OnInit {
  rgpd: RGPD;
  user: UserAPILMT;

  rgpdsSubscription: Subscription;
  rgpdMap = new Map<number, RGPD>();
  constructor(
      private userAPILMTService: UserApilmtService,
      private rgpdService: RgpdService,
      private router: Router,
      private alertCtrl: AlertController
  ) { }

  ngOnInit() {


  }

  confirmation() {
    this.rgpd = new RGPD();
    this.rgpd.aconfirme = true;
    this.rgpd.arefuse = false;
    this.rgpd.user = this.userAPILMTService.userFromAPI;
    this.getConnected();
  }

  private getConnected() {
    this.rgpdService.addRGPD(this.rgpd);
    if (this.rgpd.aconfirme === true) {
      this.router.navigate(['/home-results']);
    } else {
      this.router.navigate(['/']);
    }

  }

  refus() {
    this.rgpd = new RGPD();
    this.rgpd.aconfirme = false;
    this.rgpd.arefuse = true;
    this.rgpd.user = this.userAPILMTService.userFromAPI;
    this.getConnected();
  }
}
