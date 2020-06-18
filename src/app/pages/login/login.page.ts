import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {Subscription} from 'rxjs';
import {RGPD} from '../../../models/RGPD';
import {RgpdService} from '../../service/rgpd.service';
// import { ParticlesConfig } from '../../../particles-config';
// import { ParticlesModule } from 'angular-particle';

// declare const particlesJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  public onLoginForm: FormGroup;
  myStyle: object = {};
  myParams: object = {};
  width:  100;
  height = 100;
  private userFromAPI: UserAPILMT;
  private userFromAPISubscription: Subscription;
  rgpdsSubscription: Subscription;
  rgpdMap = new Map<number, RGPD>();

  constructor(
      public navCtrl: NavController,
      public menuCtrl: MenuController,
      public toastCtrl: ToastController,
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private userAPILMTService: UserApilmtService,
      private rgpdService: RgpdService) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);

  }


  ngOnInit() {

    this.rgpdsSubscription = this.rgpdService.rgpdSubject.subscribe(
        (rgpds: RGPD[]) => {

          rgpds.forEach(rg => {
            if (rg && (rg.aconfirme === true) && (!this.rgpdMap.has(rg.user.id))) {
              this.rgpdMap.set(rg.user.id, rg);
            }
          });
        }
    );

    this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
        (user: UserAPILMT) => {
          this.userFromAPI = user;
        }
    );
    this.rgpdService.getAllRGPDs();
  }

  OnSubmitLogin() {
    // const pass = Md5.hashStr(this.password).toString();
    this.authService.login(this.email, this.password).then(res => {
      this.userAPILMTService.getUserByEmail(this.email);
      this.getAppropriatePage();
    }).catch();
  }

  getAppropriatePage() {
    if (this.rgpdMap.has(this.userFromAPI.id)) {

      this.router.navigate(['/home-results']);
    } else {

      this.router.navigate(['/rgpd']);
    }
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  /*goToRegister() {
    this.navCtrl.navigateRoot('/register');
  }*/

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

  goToResetPassword() {
    this.navCtrl.navigateForward('/reset-password');
  }
  // public invokeParticles() {
  //   particlesJS('particles-js', ParticlesConfig, function() {});
  //   console.log('ParticlesConfig is loaded');
  // }
  private updateUser() {
    this.userFromAPI.isOnLine = true;
    this.userAPILMTService.updateUser(this.userFromAPI);
    this.router.navigate(['/home-results']);
  }
}
