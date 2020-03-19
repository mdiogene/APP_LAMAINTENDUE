import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-maraude',
    templateUrl: './maraude.page.html',
    styleUrls: ['./maraude.page.scss'],
})
export class MaraudePage implements OnInit, OnDestroy {
    maraude = new Maraude();
    maraudes: Maraude[] = [];
    maraudesSubscription: Subscription;
    localUserIsLogged = new User();
    userFromAPISubscription: Subscription;
    usersFromAPISubscription: Subscription;
    userFromAPI = new UserAPILMT();
    usersFromAPI: UserAPILMT[] = [];
    usersForMaraude: UserAPILMT[] = [];
    maraudeUser = new MaraudeUsers();
    maraudeUsers: MaraudeUsers[] = [];
    maraudeUserFromAPISubscription: Subscription;
    participate: string;
    vehicule: string;
    canAddParticipant: boolean;
    maraudesMap = new Map<number, Maraude>();
    usersMapArray = new Map<number, Map<number, UserAPILMT[]>>();
    maraudeUsersMap = new Map<number, MaraudeUsers>();
    hasNextMaraude: boolean;
    hasPreviousMaraude: boolean;
    usersMap = new Map<number, UserAPILMT[]>();

    constructor(private datePipe: DatePipe,
                public af: AngularFireAuth,
                private maraudesAPILMTService: MaraudeService,
                private authService: AuthService,
                private userAPILMTService: UserApilmtService,
                private maraudeUserAPILMTService: MaraudeUsersService) {
    }

    ngOnInit() {
        this.maraudesSubscription = this.maraudesAPILMTService.maraudesSubject.subscribe(
            (maraudes: Maraude[]) => {

                if (maraudes) {
                    maraudes.forEach(maraude => {
                        const nowDate = this.datePipe.transform(new Date().toISOString(), 'yyyy MM dd hh mm');
                        const maraudeDate = this.datePipe.transform(maraude.date, 'yyyy MM dd hh mm');
                        if ((nowDate < maraudeDate) || (nowDate === maraudeDate)) {
                            this.maraudes.push(maraude);
                            this.maraudesMap.set(maraude.id, maraude);
                            this.hasPrevious();
                            this.hasNext();
                        }
                    });
                    this.maraude = this.maraudes[this.maraudes.length - 1];
                }
            }
        );

        this.userFromAPISubscription = this.userAPILMTService.userAPILMTSubject.subscribe(
            (user: UserAPILMT) => {
                this.userFromAPI = user;
            }
        );
        this.usersFromAPISubscription = this.userAPILMTService.usersAPILMTSubject.subscribe(
            (users: UserAPILMT[]) => {
                this.usersFromAPI = users;
            }
        );

        this.maraudeUserFromAPISubscription = this.maraudeUserAPILMTService.maraudeUsersSubject.subscribe(
            (maraudeUsers: MaraudeUsers[]) => {
                this.maraudeUsers = maraudeUsers;
            });

        this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
        this.localUserIsLogged = this.authService.localUser;
        this.maraudesAPILMTService.getAllMaraudes();
        this.maraudeUserAPILMTService.getAllMaraudeUsers();
        this.getUsersForMaraude();
    }

    getUsersForMaraude(): void {
        this.maraudes.forEach(maraude => {
            this.usersForMaraude = [];
            this.maraudeUsers.forEach(maraudeUser => {
                if (maraudeUser.maraude.id === maraude.id) {
                    this.usersForMaraude.push(maraudeUser.user);
                }
            });
            this.usersMap.set(maraude.id, this.usersForMaraude);
        });
        // this.maraudeUsers.forEach( maraudeUser => {
        //   if (!this.usersMapArray.has(maraudeUser.maraude.id)) {
        //     this.usersMapArray.set(maraudeUser.maraude.id, this.usersMap);
        //   }
        // });

    }

    getUserConnectedWithAPILMT(userUID: string): void {
        this.userAPILMTService.getUserByFirebaseId(userUID);
    }

    sendPartipation(maraude: Maraude) {
        this.getUsersForMaraude();
        this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
        this.saveUserParticipation(maraude);
    }

    saveUserParticipation(maraude: Maraude) {
        if (this.usersMap.has(maraude.id)) {
            const usersArrayLenght = this.usersMap.get(maraude.id).length;
            if (maraude.participantMax > usersArrayLenght) {
                this.maraudeUser.user = this.userFromAPI;
                this.maraudeUser.maraude = maraude;
                this.isParticipate(this.participate);
                this.maraudeUserAPILMTService.addMaraudeUser(this.maraudeUser);
                this.usersMap.get(maraude.id).unshift(this.userFromAPI);
                console.log('nombre maximal de participants n est pas atteint');
                console.log(this.maraudeUser);
            } else {
                console.log('Desolé nombre maximal de participants atteint');
                console.log(usersArrayLenght);
            }
        } else {
            console.log('je suis le premier inscrit');
            this.maraudeUser.user = this.userFromAPI;
            this.usersForMaraude.unshift(this.userFromAPI);
            this.usersMap.set(maraude.id, this.usersForMaraude);
            this.maraudeUser.maraude = maraude;
            this.isParticipate(this.participate);
            this.maraudeUserAPILMTService.addMaraudeUser(this.maraudeUser);
        }
    }

    canAddMaraudeParticipants(maraude: Maraude): boolean {
        if (this.usersMap.has(maraude.id)) {
            const usersArrayLenght = this.usersMap.get(maraude.id).length;
            if (maraude.participantMax > usersArrayLenght) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    isParticipate(part: string) {
        if (part === 'participe') {
            this.maraudeUser.participate = true;
        } else {
            this.maraudeUser.participate = false;
        }
    }

    isVehicule(vehicule: string): boolean {
        if (vehicule === 'vehicule') {
            this.userFromAPI.vehicule = true;
        } else {
            this.userFromAPI.vehicule = false;
        }
        return this.userFromAPI.vehicule;
    }

    next() {
        const maraudeNext = this.maraude;
        if ((this.maraudes.length > 1) && ((this.maraudes.indexOf(this.maraude)) < (this.maraudes.length - 1))) {
            this.maraude = this.maraudes[this.maraudes.indexOf(maraudeNext) + 1];
        }
    }

    previous() {
        const maraudePrevious = this.maraude;
        if ((this.maraudes.length > 1) && ((this.maraudes.indexOf(this.maraude)) > 0)) {
            this.maraude = this.maraudes[this.maraudes.indexOf(maraudePrevious) - 1];
        }
    }

    hasNext(): boolean {

        if ((this.maraudes.length > 1) && ((this.maraudes.indexOf(this.maraude)) < (this.maraudes.length - 1))) {
            this.hasNextMaraude = true;
        } else {
            this.hasNextMaraude = false;
        }
        return this.hasNextMaraude;
    }

    hasPrevious(): boolean {
        if ((this.maraudes.length > 1) && ((this.maraudes.indexOf(this.maraude)) > 0)) {
            this.hasPreviousMaraude = true;
        } else {
            this.hasPreviousMaraude = false;
        }
        return this.hasPreviousMaraude;
    }

    ngOnDestroy(): void {
        this.userFromAPISubscription.unsubscribe();
        this.usersFromAPISubscription.unsubscribe();
        this.maraudeUserFromAPISubscription.unsubscribe();
    }
}
