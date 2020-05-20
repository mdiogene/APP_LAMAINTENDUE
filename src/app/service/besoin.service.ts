import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {apiLMT} from '../../environments/environment';
import {BesoinsRemontes} from '../../models/BesoinsRemontes';

@Injectable({
  providedIn: 'root'
})
export class BesoinService {

  private besoinsRemontesAPILMTUrl = `${apiLMT.url}/besoinsRemonteses`;
  besoinsRemontesSubject = new Subject<BesoinsRemontes[]>();
  besoinsRemontes: BesoinsRemontes[] = [];
  besoinsRemonte: BesoinsRemontes;
  besoinsRemonteSubject  = new Subject<BesoinsRemontes>();

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {
  }

  emitBesoinSubject() {
    if (this.besoinsRemontes) {
      this.besoinsRemontesSubject.next(this.besoinsRemontes);
    }
    this.loadingService.hideLoading();
  }
  //
  // emitBesoinSubject() {
  //   if (this.besoinsRemonte) {
  //     this.besoinsRemonteSubject.next(this.besoinsRemonte);
  //   }
  //   this.loadingService.hideLoading();
  // }

  getAllBesoin(): void {
    this.loadingService.showLoading();
    this.besoinsRemontes = null;
    this.http.get<any>(this.besoinsRemontesAPILMTUrl).subscribe(
        next => {
          const besoinsRemontes = next;
          if (next) {
            this.besoinsRemontes = besoinsRemontes._embedded.besoinsRemonteses;
            console.log(this.besoinsRemontes);
          }
          this.emitBesoinSubject();
        },
        error => {
          this.handleError(error);
        }
    );

  }

  // Création du besoin besoinsRemontes
  addBesoinsRemonte(besoinsRemonte: BesoinsRemontes): void {
    this.loadingService.showLoading();
    this.http.post<BesoinsRemontes>(this.besoinsRemontesAPILMTUrl, besoinsRemonte).subscribe(
        next => {
          this.besoinsRemontes[this.besoinsRemontes.indexOf(besoinsRemonte)] = next;
          // this.besoinsRemontes.unshift(next);
          this.emitBesoinSubject();
        },
        error => {
          this.handleError(error);
        }
    );
  }


  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }

  updateBesoinsRemonte(besoin: BesoinsRemontes) {

  }

  deleteBesoinsRemonte(besoin: BesoinsRemontes) {

  }
}
