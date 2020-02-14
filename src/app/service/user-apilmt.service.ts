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

@Injectable({
  providedIn: 'root'
})
export class UserApilmtService {
  private userAPILMTUrl = `${apiLMT.url}/users`;
  private userRolesAPILMTUrl = `${apiLMT.url}/userRoles`;
  users: User[] = [];
  user = new User();
  userByEmail: User;

  // usersSubject = new Subject<User[]>();
  // roleIdSubject = new Subject<number>();
  userSubject = new Subject<User>();
  userByEmailSubject = new Subject<User>();
  // userRoleEnregistre: UserRole;
  // userRoles: UserRole[] = [];
  // role: Role;
  // userRolesSubject = new Subject<UserRole[]>();

  constructor(private http: HttpClient,
              public loadingService: LoadingService,
              public alertService: AlertService) { }


  emitUserSubject() {
    this.userSubject.next(this.user);
   this.loadingService.hideLoading();
  }

  emitUserByEmailSubject() {
    this.userByEmailSubject.next(this.userByEmail);
   this.loadingService.hideLoading();
  }

  getUserByEmail(email: string): void {
   this.loadingService.showLoading();
    this.userByEmail = null;
    if (email) {
      this.http.get<User>(this.userAPILMTUrl + '/search/findByEmail?email=' + email).subscribe(
          next => {
            if (next) {
              this.userByEmail = next;
            }
            this.emitUserByEmailSubject();
          },
          error => {
            this.handleError(error);
          }
      );
    }
  }

  getUserByFirebaseId(firebaseId: string): void {
    this.loadingService.showLoading();
    this.userByEmail = null;
    if (firebaseId) {
      this.http.get<User>(this.userAPILMTUrl + '/search/findByUserId?userId=' + firebaseId).subscribe(
          next => {
            if (next) {
              this.user = next;
            }
            this.emitUserSubject();
          },
          error => {
            this.handleError(error);
          }
      );
    }
  }


  handleError(error): void {
   this.loadingService.hideLoading();
    this.alertService.error(error.message);
  }
}
