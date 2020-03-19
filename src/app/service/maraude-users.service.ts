import { Injectable } from '@angular/core';
import {apiLMT} from '../../environments/environment';
import {Subject} from 'rxjs';
import {MaraudeUsers} from '../../models/MauraudeUsers';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaraudeUsersService {
  private maraudeUsersAPILMTUrl = `${apiLMT.url}/maraudeUserses`;
  maraudeUsersSubject = new Subject<MaraudeUsers[]>();
  maraudeUsers: MaraudeUsers[] = [];
  constructor(private alertService: AlertService, private loadingService: LoadingService, private http: HttpClient) { }


  emitMaraudeUsersSubject() {
    if (this.maraudeUsers) {
      this.maraudeUsersSubject.next(this.maraudeUsers);
    }
    this.loadingService.hideLoading();
  }

  getAllMaraudeUsers(): void {
    this.loadingService.showLoading();
    this.maraudeUsers = null;
    this.http.get<any>(this.maraudeUsersAPILMTUrl).subscribe(
        next => {
            const maraudeUsers = next._embedded.maraudeUserses;
            if (maraudeUsers && maraudeUsers.length > 0) {
                this.maraudeUsers = next._embedded.maraudeUserses;
            }
          console.log(this.maraudeUsers);
          this.emitMaraudeUsersSubject();
        },
        error => {
          this.handleError(error);
        }
    );

  }

  // Création de la Maraude
  addMaraudeUser(maraudeUser: MaraudeUsers): void {
    this.loadingService.showLoading();
    this.http.post<MaraudeUsers>(this.maraudeUsersAPILMTUrl, maraudeUser).subscribe(
        next => {
          this.maraudeUsers[this.maraudeUsers.indexOf(maraudeUser)] = next;
          this.maraudeUsers.unshift(next);
          this.emitMaraudeUsersSubject();
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
