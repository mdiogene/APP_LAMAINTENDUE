import { Injectable } from '@angular/core';
import {BesoinUsers} from '../../models/BesoinUsers';
import {apiLMT} from '../../environments/environment';
import {Subject} from 'rxjs';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BesoinUsersService {

  private reponseAuxBesoinsAPILMTUrl = `${apiLMT.url}/besoinUserses`;
  reponseAuxBesoinsSubject = new Subject<BesoinUsers[]>();
  reponseAuxBesoins: BesoinUsers[] = [];

  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) {
  }

  emitBesoinUsersSubject() {
    if (this.reponseAuxBesoinsSubject) {
      this.reponseAuxBesoinsSubject.next(this.reponseAuxBesoins);
    }
    this.loadingService.hideLoading();
  }

  getAllBesoinUsers(): void {
    this.loadingService.showLoading();
    this.reponseAuxBesoins = null;
    this.http.get<any>(this.reponseAuxBesoinsAPILMTUrl).subscribe(
        next => {
          const reponseAuxBesoins = next;
          if (next) {
            this.reponseAuxBesoins = reponseAuxBesoins._embedded.besoinUserses;
          }
          console.log(this.reponseAuxBesoins);
          this.emitBesoinUsersSubject();
        },
        error => {
          this.handleError(error);
        }
    );

  }

  // Création du besoin reponseAuxBesoins
  addBesoinUsers(reponseAuxBesoins: BesoinUsers): void {
    this.loadingService.showLoading();
    this.http.post<BesoinUsers>(this.reponseAuxBesoinsAPILMTUrl, reponseAuxBesoins).subscribe(
        next => {
            console.log('besoin user participants dans le service');
            console.log(next);

            this.reponseAuxBesoins[this.reponseAuxBesoins.indexOf(reponseAuxBesoins)] = next;
          this.reponseAuxBesoins.unshift(next);
          this.emitBesoinUsersSubject();
        },
        error => {
          this.handleError(error);
        }
    );
  }


  handleError(error): void {
    this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }}
