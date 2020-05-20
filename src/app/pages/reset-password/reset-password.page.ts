import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {Subscription} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: string;
  password: string;
  public onLoginForm: FormGroup;
  myStyle: object = {};
    myParams: object = {};
    width:  100;
    height = 100;
  private userFromAPI: UserAPILMT;
  private userFromAPISubscription: Subscription;

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
    public AFauth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
      (user: UserAPILMT) => {
        this.userFromAPI = user;
      }
  );

  }

  onResetPassword() {
    console.log(this.authService.resetPass(this.email));
    this.authService.resetPass(this.email).then(data => {
      console.log(data);
      const toast = this.toastCtrl.create({
        message: 'un email a été envoyer à votre adresse mail pour la modification de votre mot de passe',
        duration: 3000,
        position: 'top'
      });

      this.router.navigate(['/login']);
    }).catch(err => {
      console.log('failed ${err}');
      alert('echec');
    });
  }

}
