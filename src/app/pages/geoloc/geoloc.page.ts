import { Component, ViewChild, ElementRef,  OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
// import { watch } from 'fs';

declare var google: any;
@Component({
  selector: 'app-geoloc',
  templateUrl: './geoloc.page.html',
  styleUrls: ['./geoloc.page.scss'],
})
export class GeolocPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  markers = [];
  ref = firebase.database().ref('Geolok/');
  watch: any;

  constructor(public navCtrl: NavController, public platform: Platform, private geolocation: Geolocation, private device: Device) {
    platform.ready().then( () => {
      this.initMap();
    });
    this.ref.on('value', resp => {
      this.deleteMarkers();
      snapshotToArray(resp).forEach(data => {
        if (data.uuid !== this.device.uuid) {
          // tslint:disable-next-line:prefer-const
          let image = 'assets/img/green.png';
          // tslint:disable-next-line:prefer-const
          let updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
          this.addMarker(updatelocation, image);
          this.setMapOnAll(this.map);
        } else {
          // tslint:disable-next-line:prefer-const
          let image = 'assets/img/blue-bike.png';
          // tslint:disable-next-line:prefer-const
          let updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
          this.addMarker(updatelocation, image);
          this.setMapOnAll(this.map);
        }
      });
    });
  }

  ngOnInit() {
  }

   // fonction qui permet de charger Google Map
   initMap() {
     // position actuelle
     this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
       // tslint:disable-next-line:prefer-const
       let mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
       this.map = new google.maps.Map(this.mapElement.nativeElement, {
         zoom: 15,
         center: mylocation
       });
     });
     // tslint:disable-next-line:prefer-const
     // tslint:disable-next-line:no-shadowed-variable
     // tslint:disable-next-line:prefer-const
     // tslint:disable-next-line:no-shadowed-variable

     // Mise à jour en cas de changement de position
     const watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       this.deleteMarkers();
       // tslint:disable-next-line:prefer-const
       let updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
       // tslint:disable-next-line:prefer-const
       let image = 'assets/img/myicon.png';
       this.addMarker(updatelocation, image);
       this.setMapOnAll(this.map);
     });
   }

   // Ajoute Marqueur de position
   addMarker(location, image) {
     // tslint:disable-next-line:prefer-const
     let marker = new google.maps.Marker({
       position: location,
       map: this.map,
       icon: image
     });
     this.markers.push(marker);
   }
   setMapOnAll(map) {
     // tslint:disable-next-line:no-var-keyword
     for (var i = 0; i < this.markers.length; i++) {
       this.markers[i].setMap(map);
     }
   }
   clearMarkers() {
     this.setMapOnAll(null);
   }
   deleteMarkers() {
     this.clearMarkers();
     this.markers = [];
   }
   // fonction pour mettre à jour et ajouter des données de géolocalisation à la base de données Firebase.
   updateGeolocation(uuid, lat, lng) {
     if (localStorage.getItem('mykey')) {
       firebase.database().ref('Geolok/' + localStorage.getItem('mykey')).set({
         uuid: uuid,
         latitude: lat,
         longitude : lng
       });
     } else {
       // tslint:disable-next-line:prefer-const
       let newData = this.ref.push();
       newData.set({
         uuid: uuid,
         latitude: lat,
         longitude: lng
       });
       localStorage.setItem('mykey', newData.key);
     }
     // tslint:disable-next-line:no-shadowed-variable
     const watch = this.geolocation.watchPosition();
     watch.subscribe((data: { coords: { latitude: any; longitude: any; }; }) => {
       this.deleteMarkers();
       this.updateGeolocation(this.device.uuid, data.coords.latitude, data.coords.longitude);
       // tslint:disable-next-line:prefer-const
       let updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
       // tslint:disable-next-line:prefer-const
       let image = 'assets/img/blueicon.jpg';
       this.addMarker(updatelocation, image);
       this.setMapOnAll(this.map);
     });
   }

 }
 // conversion de données Firebase en tableau
 export const snapshotToArray = (snapshot: { forEach: (arg0: (childSnapshot: any) => void) => void; }) => {
   // tslint:disable-next-line:prefer-const
   let returnArr = [];

   snapshot.forEach(childSnapshot => {
       // tslint:disable-next-line:prefer-const
       let item = childSnapshot.val();
       item.key = childSnapshot.key;
       returnArr.push(item);
   });

   return returnArr;
 };
