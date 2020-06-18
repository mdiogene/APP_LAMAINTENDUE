import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BesoinsRemontes} from '../../../models/BesoinsRemontes';

import {User} from '../../../models/User';
import {AuthService} from '../../service/auth.service';
import {UserApilmtService} from '../../service/user-apilmt.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {UserAPILMT} from '../../../models/UserAPILMT';
import {BesoinUsersService} from '../../service/besoin-users.service';
import {BesoinUsers} from '../../../models/BesoinUsers';
import {DatePipe} from '@angular/common';
import {BesoinService} from '../../service/besoin.service';



@Component({
    selector: 'app-besoin',
    templateUrl: './besoin.page.html',
    styleUrls: ['./besoin.page.scss'],
})
export class BesoinPage implements OnInit, OnDestroy {
    besoinAjoute: boolean;
    besoin = new BesoinsRemontes();
    besoins: BesoinsRemontes[] = [];
    besoinsSubscription: Subscription;
    localUserIsLogged = new User();
    userFromAPISubscription: Subscription;
    usersFromAPISubscription: Subscription;
    userFromAPI = new UserAPILMT();
    usersFromAPI: UserAPILMT[] = [];
    usersForBesoinsRemontes: UserAPILMT[] = [];
    besoinUser = new BesoinUsers();
    besoinUsers: BesoinUsers[] = [];
    besoinUserFromAPISubscription: Subscription;
    participate: string;
    vehicule: string;
    canAddParticipant = true;
    besoinsMap = new Map<number, BesoinsRemontes>();
    usersMapArray = new Map<number, Map<number, UserAPILMT[]>>();
    besoinUsersMap = new Map<number, BesoinUsers>();
    hasNextBesoinsRemontes: boolean;
    hasPreviousBesoinsRemontes: boolean;
    usersMap = new Map<number, UserAPILMT[]>();
    private participantDejaInscrit = false;
    private allUsersForBesoinsRemontes: UserAPILMT[] = [];

    constructor(private datePipe: DatePipe,
                public af: AngularFireAuth,
                private besoinsAPILMTService: BesoinService,
                private authService: AuthService,
                private userAPILMTService: UserApilmtService,
                private besoinUserAPILMTService: BesoinUsersService) {
    }

    ngOnInit() {
        this.besoinAjoute = false;
        this.besoinsSubscription = this.besoinsAPILMTService.besoinsRemontesSubject.subscribe(
            (besoins: BesoinsRemontes[]) => {

                if (besoins) {
                    besoins.forEach(besoin => {
                        const nowDate = this.datePipe.transform(new Date().toISOString(), 'yyyy MM dd hh mm');
                        const besoinDate = this.datePipe.transform(besoin.dateCreation, 'yyyy MM dd hh mm');
                        if ((nowDate < besoinDate) || (nowDate === besoinDate)) {
                            this.besoins.push(besoin);
                            this.besoinsMap.set(besoin.id, besoin);
                            this.hasPrevious();
                            this.hasNext();
                        }
                    });
                    this.besoin = this.besoins[this.besoins.length - 1];
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

        this.besoinUserFromAPISubscription = this.besoinUserAPILMTService.reponseAuxBesoinsSubject.subscribe(
            (besoinUsers: BesoinUsers[]) => {
                this.besoinUsers = besoinUsers;
            });

        this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);

        this.localUserIsLogged = this.authService.localUser;
        this.besoinsAPILMTService.getAllBesoin();
        this.besoinUserAPILMTService.getAllBesoinUsers();
        this.getUsersForBesoinsRemontes();
        this.canAddBesoinsRemontesParticipants();
    }

    getUsersForBesoinsRemontes(): void {
        this.getAllUsersForBesoinsRemontes();
        this.besoins.forEach(besoin => {
            this.usersForBesoinsRemontes = [];
            this.besoinUsers.forEach(besoinUser => {
                if ((besoinUser.besoinsRemontes.id === besoin.id) && (besoinUser.participate === true)) {
                    this.usersForBesoinsRemontes.push(besoinUser.user);
                }
            });
            this.usersMap.set(besoin.id, this.usersForBesoinsRemontes);
            this.canAddBesoinsRemontesParticipants();
        });
    }

    getAllUsersForBesoinsRemontes(): void {
        this.besoins.forEach(besoin => {
            this.usersForBesoinsRemontes = [];
            this.besoinUsers.forEach(besoinUser => {
                console.log('user et userbesoin');
                console.log(besoinUser);
                console.log(besoin);
                if (besoinUser.besoinsRemontes.id === besoin.id) {
                    this.allUsersForBesoinsRemontes.push(besoinUser.user);
                }
            });
            this.usersMap.set(besoin.id, this.usersForBesoinsRemontes);
            this.canAddBesoinsRemontesParticipants();
        });
    }

    getUserConnectedWithAPILMT(userUID: string): void {
        this.userAPILMTService.getUserByFirebaseId(userUID);
    }

    sendPartipation(besoin: BesoinsRemontes) {
        console.log('besoin ajouté');
        console.log(besoin);
        this.besoinAjoute = false;
        this.getUsersForBesoinsRemontes();
        this.getUserConnectedWithAPILMT(this.af.auth.currentUser.uid);
        this.saveUserParticipation(besoin);
    }

    saveUserParticipation(besoin: BesoinsRemontes) {
        this.participantDejaInscrit = false;
       // this.besoinUser.besoin = besoin;
        if (this.usersMap.has(besoin.id)) {
            const usersArrayLenght = this.usersMap.get(besoin.id);

            console.log('usersMap participants');
            console.log(this.usersMap);

            if (besoin.quantite > usersArrayLenght.length) {
                // if (besoin.participantMax > this.usersForBesoinsRemontes.length) {
                this.canAddParticipant = true;
                this.besoinUser.user = this.userFromAPI;
                this.besoinUser.besoinsRemontes = besoin;
                this.besoinUser.quantite = besoin.quantite;
                this.isParticipate(this.participate);
                usersArrayLenght.forEach( user => {
                    if (user.email === this.userFromAPI.email) {
                        this.canAddParticipant = false;
                    }
                    this.allUsersForBesoinsRemontes.forEach( userInscrit => {
                        if (userInscrit.email === this.userFromAPI.email) {
                            this.participantDejaInscrit = true;
                        }
                    });
                });
                if (this.canAddParticipant) {
                    console.log('besoin user participants');
                    console.log(this.besoinUser);

                    // this.userAPILMTService.updateUser(this.userFromAPI);
                    this.besoinUserAPILMTService.addBesoinUsers(this.besoinUser);
                    this.besoinAjoute = true;
                    this.usersMap.get(besoin.id).unshift(this.userFromAPI);
                }
            } else {
                this.canAddParticipant = false;
            }
        } else {
            console.log('je suis le premier inscrit');
            this.besoinUser.user = this.userFromAPI;
            this.usersForBesoinsRemontes.unshift(this.userFromAPI);
            this.usersMap.set(besoin.id, this.usersForBesoinsRemontes);
            this.besoinUser.besoinsRemontes = besoin;
            this.isParticipate(this.participate);
            this.besoinUserAPILMTService.addBesoinUsers(this.besoinUser);
            this.canAddParticipant = true;
        }
    }

    canAddBesoinsRemontesParticipants(): boolean {
        if (this.usersMap.has(this.besoin.id)) {
            const usersArrayLenght = this.usersMap.get(this.besoin.id).length;
            if (this.besoin.quantite > usersArrayLenght) {
                this.canAddParticipant = true;
                return true;
            } else {
                this.canAddParticipant = false;
                return false;
            }
        } else {
            this.canAddParticipant = true;
            return true;
        }
    }

    isParticipate(part: string) {
        if (part === 'participe') {
            this.besoinUser.participate = true;
        } else {
            this.besoinUser.participate = false;
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
        this.besoinAjoute = false;
        this.getUsersForBesoinsRemontes();
        const besoinNext = this.besoin;
        if ((this.besoins.length > 1) && ((this.besoins.indexOf(this.besoin)) < (this.besoins.length - 1))) {
            this.besoin = this.besoins[this.besoins.indexOf(besoinNext) + 1];
        }
        this.canAddBesoinsRemontesParticipants();
    }

    previous() {
        this.besoinAjoute = false;
        this.getUsersForBesoinsRemontes();
        const besoinPrevious = this.besoin;
        if ((this.besoins.length > 1) && ((this.besoins.indexOf(this.besoin)) > 0)) {
            this.besoin = this.besoins[this.besoins.indexOf(besoinPrevious) - 1];
        }
        this.canAddBesoinsRemontesParticipants();
    }

    hasNext(): boolean {

        if ((this.besoins.length > 1) && ((this.besoins.indexOf(this.besoin)) < (this.besoins.length - 1))) {
            this.hasNextBesoinsRemontes = true;
        } else {
            this.hasNextBesoinsRemontes = false;
        }
        return this.hasNextBesoinsRemontes;
    }

    hasPrevious(): boolean {
        if ((this.besoins.length > 1) && ((this.besoins.indexOf(this.besoin)) > 0)) {
            this.hasPreviousBesoinsRemontes = true;
        } else {
            this.hasPreviousBesoinsRemontes = false;
        }
        return this.hasPreviousBesoinsRemontes;
    }

    ngOnDestroy(): void {
        this.userFromAPISubscription.unsubscribe();
        this.usersFromAPISubscription.unsubscribe();
        this.besoinUserFromAPISubscription.unsubscribe();
    }
}
