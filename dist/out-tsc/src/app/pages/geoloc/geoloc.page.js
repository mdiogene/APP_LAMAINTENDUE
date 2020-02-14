var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import * as firebase from 'firebase';
var GeolocPage = /** @class */ (function () {
    function GeolocPage(navCtrl, platform, geolocation, device) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.geolocation = geolocation;
        this.device = device;
        this.markers = [];
        this.ref = firebase.database().ref('Geolok/');
        platform.ready().then(function () {
            _this.initMap();
        });
        this.ref.on('value', function (resp) {
            _this.deleteMarkers();
            snapshotToArray(resp).forEach(function (data) {
                if (data.uuid !== _this.device.uuid) {
                    // tslint:disable-next-line:prefer-const
                    var image = 'assets/img/green.png';
                    // tslint:disable-next-line:prefer-const
                    var updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
                    _this.addMarker(updatelocation, image);
                    _this.setMapOnAll(_this.map);
                }
                else {
                    // tslint:disable-next-line:prefer-const
                    var image = 'assets/img/blue-bike.png';
                    // tslint:disable-next-line:prefer-const
                    var updatelocation = new google.maps.LatLng(data.latitude, data.longitude);
                    _this.addMarker(updatelocation, image);
                    _this.setMapOnAll(_this.map);
                }
            });
        });
    }
    GeolocPage.prototype.ngOnInit = function () {
    };
    // fonction qui permet de charger Google Map
    GeolocPage.prototype.initMap = function () {
        var _this = this;
        // position actuelle
        this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then(function (resp) {
            // tslint:disable-next-line:prefer-const
            var mylocation = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, {
                zoom: 15,
                center: mylocation
            });
        });
        // tslint:disable-next-line:prefer-const
        // tslint:disable-next-line:no-shadowed-variable
        // tslint:disable-next-line:prefer-const
        // tslint:disable-next-line:no-shadowed-variable
        // Mise à jour en cas de changement de position
        var watch = this.geolocation.watchPosition();
        watch.subscribe(function (data) {
            _this.deleteMarkers();
            // tslint:disable-next-line:prefer-const
            var updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
            // tslint:disable-next-line:prefer-const
            var image = 'assets/img/myicon.png';
            _this.addMarker(updatelocation, image);
            _this.setMapOnAll(_this.map);
        });
    };
    // Ajoute Marqueur de position
    GeolocPage.prototype.addMarker = function (location, image) {
        // tslint:disable-next-line:prefer-const
        var marker = new google.maps.Marker({
            position: location,
            map: this.map,
            icon: image
        });
        this.markers.push(marker);
    };
    GeolocPage.prototype.setMapOnAll = function (map) {
        // tslint:disable-next-line:no-var-keyword
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    };
    GeolocPage.prototype.clearMarkers = function () {
        this.setMapOnAll(null);
    };
    GeolocPage.prototype.deleteMarkers = function () {
        this.clearMarkers();
        this.markers = [];
    };
    // fonction pour mettre à jour et ajouter des données de géolocalisation à la base de données Firebase.
    GeolocPage.prototype.updateGeolocation = function (uuid, lat, lng) {
        var _this = this;
        if (localStorage.getItem('mykey')) {
            firebase.database().ref('Geolok/' + localStorage.getItem('mykey')).set({
                uuid: uuid,
                latitude: lat,
                longitude: lng
            });
        }
        else {
            // tslint:disable-next-line:prefer-const
            var newData = this.ref.push();
            newData.set({
                uuid: uuid,
                latitude: lat,
                longitude: lng
            });
            localStorage.setItem('mykey', newData.key);
        }
        // tslint:disable-next-line:no-shadowed-variable
        var watch = this.geolocation.watchPosition();
        watch.subscribe(function (data) {
            _this.deleteMarkers();
            _this.updateGeolocation(_this.device.uuid, data.coords.latitude, data.coords.longitude);
            // tslint:disable-next-line:prefer-const
            var updatelocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
            // tslint:disable-next-line:prefer-const
            var image = 'assets/img/blueicon.jpg';
            _this.addMarker(updatelocation, image);
            _this.setMapOnAll(_this.map);
        });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], GeolocPage.prototype, "mapElement", void 0);
    GeolocPage = __decorate([
        Component({
            selector: 'app-geoloc',
            templateUrl: './geoloc.page.html',
            styleUrls: ['./geoloc.page.scss'],
        }),
        __metadata("design:paramtypes", [NavController, Platform, Geolocation, Device])
    ], GeolocPage);
    return GeolocPage;
}());
export { GeolocPage };
// conversion de données Firebase en tableau
export var snapshotToArray = function (snapshot) {
    // tslint:disable-next-line:prefer-const
    var returnArr = [];
    snapshot.forEach(function (childSnapshot) {
        // tslint:disable-next-line:prefer-const
        var item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });
    return returnArr;
};
//# sourceMappingURL=geoloc.page.js.map