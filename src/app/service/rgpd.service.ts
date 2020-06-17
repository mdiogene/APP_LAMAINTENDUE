import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {apiLMT} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {LoadingService} from './loading-service.service';
import {AlertService} from './alert-service.service';
import {RGPD} from '../../models/RGPD';

@Injectable({
  providedIn: 'root'
})
export class RgpdService {
  private rgpdAPILMTUrl = `${apiLMT.url}/rGPDs`;
  rgpdSubject = new Subject<RGPD[]>();
  rgpd: RGPD[] = [];
  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {}

  emitRGPDSubject() {
    if (this.rgpd) {
      this.rgpdSubject.next(this.rgpd);
    }
    this.loadingService.hideLoading();
  }

  getAllRGPDs(): void {
    this.loadingService.showLoading();
    this.rgpd = null;
    this.http.get<any>(this.rgpdAPILMTUrl).subscribe(
        next => {
          const rgpd = next;
          if (next) {
            this.rgpd = rgpd._embedded.rGPDs;
          }
          this.emitRGPDSubject();
        },
        error => {
          this.handleError(error);
        }
    );

  }

  // Création de la rgpd
  addRGPD(rgpd: RGPD): void {
      console.log('rgpd avant');
      console.log(rgpd);
    // this.loadingService.showLoading();
    this.http.post<RGPD>(this.rgpdAPILMTUrl, rgpd).subscribe(
        next => {
            console.log('rgpd apres');
            console.log(next);
          this.rgpd[this.rgpd.indexOf(rgpd)] = next;
          this.rgpd.unshift(next);
          this.emitRGPDSubject();
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

}
