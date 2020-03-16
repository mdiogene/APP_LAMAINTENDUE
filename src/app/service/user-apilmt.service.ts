import { Injectable } from '@angular/core';
import {User} from '../../models/User';
import {Subject} from 'rxjs';
import {Role} from '../../models/Role';
import {UserRole} from '../../models/UserRole';
import {AngularFirestore} from '@angular/fire/firestore';
import {HttpClient} from '@angular/common/http';
import {apiLMT} from '../../environments/environment';
import {AlertService} from './alert-service.service';
import {LoadingService} from './loading-service.service';
import {UserAPILMT} from '../../models/UserAPILMT';

@Injectable({
  providedIn: 'root'
})
export class UserApilmtService {
  private userAPILMTUrl = `${apiLMT.url}/users`;
  private userRolesAPILMTUrl = `${apiLMT.url}/userRoles`;
  users: User[] = [];
  user = new User();
  userByEmail: User;
    userSubject = new Subject<User>();
  userByEmailSubject = new Subject<User>();
    userAPILMTSubject = new Subject<UserAPILMT>();
    usersAPILMTSubject =  new Subject<UserAPILMT[]>();
    userFromAPI: UserAPILMT;
    usersFromAPI: UserAPILMT[] = [];

    constructor(private http: HttpClient,
              public loadingService: LoadingService,
              public alertService: AlertService) { }


  emitUserAPILMTSubject() {
    this.userAPILMTSubject.next(this.userFromAPI);
   this.loadingService.hideLoading();
  }

    emitUsersAPILMTSubject() {
        this.usersAPILMTSubject.next(this.usersFromAPI);
        this.loadingService.hideLoading();
    }
    emitUserSubject() {
        this.userSubject.next(this.user);
        this.loadingService.hideLoading();
    }

    emitUserByEmailSubject() {
    this.userByEmailSubject.next(this.userByEmail);
   this.loadingService.hideLoading();
  }


    getAllUsersAPILMT(): void {
        this.loadingService.showLoading();
        this.http.get<any>(this.userAPILMTUrl).subscribe(
            next => {
                const users = next._embedded.users;
                if (users && users.length > 0) {
                    this.usersFromAPI = next._embedded.users;
                }
                this.emitUsersAPILMTSubject();
            },
            error => {
                console.log(error);
                this.handleError(error);
            }
        );
    }

  getUserByEmail(email: string): UserAPILMT {
   this.loadingService.showLoading();
    this.userByEmail = null;
    if (email) {
      this.http.get<UserAPILMT>(this.userAPILMTUrl + '/search/findByEmail?email=' + email).subscribe(
          next => {
            if (next) {
              this.userFromAPI = next;
            }
            this.emitUserAPILMTSubject();
          },
          error => {
            this.handleError(error);
          }
      );
    }
    return this.userFromAPI;
  }

  getUserByFirebaseId(firebaseId: string): UserAPILMT {
    this.loadingService.showLoading();
    this.userByEmail = null;
    if (firebaseId) {
      this.http.get<UserAPILMT>(this.userAPILMTUrl + '/search/findByUserId?userId=' + firebaseId).subscribe(
          next => {
            if (next) {
              // this.user = next;
              this.userFromAPI = next;
                return this.userFromAPI;
            }
            this.emitUserAPILMTSubject();
          },
          error => {
            this.handleError(error);
          }
      );
    }
    return;
  }


  handleError(error): void {
   this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}