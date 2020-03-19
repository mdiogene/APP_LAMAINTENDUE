import { NgModule, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicModule, IonicRouteStrategy, IonContent } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modal Pages
import { ImagePageModule } from './pages/modal/image/image.module';
import { SearchFilterPageModule } from './pages/modal/search-filter/search-filter.module';

// Components
import { NotificationsComponent } from './components/notifications/notifications.component';

// FireBase
import { firebaseConfig } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

// pour utiliser google maps et firebase
import { Device } from '@ionic-native/device/ngx';

// utilser le module pour importer les photos de son téléphone et envoi image
import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import {Camera} from '@ionic-native/camera/ngx';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {DatePipe} from '@angular/common';
// import { ParticlesModule } from 'angular-particle';


@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ImagePageModule,
    SearchFilterPageModule,
    // ParticlesModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  entryComponents: [NotificationsComponent],
  providers: [
    StatusBar,
    AngularFireModule,
    AngularFireAuth,
    AngularFireAuthModule,
    AngularFirestore,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorage,
    Geolocation,
    Device,
    File,
    FileChooser,
    FilePath,
    IonContent,
    Camera,
    SplashScreen,
    InAppBrowser,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
