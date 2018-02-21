import { Component, OnInit } from '@angular/core';
import { HotelService } from './hotel/hotel.service';
import { Hotel } from './hotel/hotel';
import { MatSnackBar } from '@angular/material';
import { SyncService } from './sync/sync.service';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  hotels: Hotel[] = [];
  registration: PushSubscription;

  constructor(
    private snackBar: MatSnackBar,
    private hotelService: HotelService,
    private swUpdate: SwUpdate, 
    private swPush: SwPush) {
  }

  ngOnInit(): void {
    this.hotelService.findAll().subscribe(
      hotels => this.hotels = hotels,
      err => this.snackBar.open('Error loading hotels: ' + err.status, null, { duration: 4000 })
    );

    this.setupPush();
    this.setupUpdates();
    this.setupNotifications();
  }

  rate(hotel: Hotel, rating: number) {
    hotel.stars = rating;
    this.hotelService.enqueueRating(hotel);
  }

  setupNotifications(): void {
    if('serviceWorker' in navigator){
      navigator.serviceWorker.addEventListener('message', event => {
          if (typeof event.data !== 'string') return;
          this.snackBar.open(event.data, 'OK');
      });
    }
  }

  setupPush() {
    
    this.swPush.requestSubscription({
      serverPublicKey: 'BBc7Bb5f5CRJp7cx19kPHz5d9S5jFSzogxEj2V1C44WuhTwd78tnXLPzOxGe0bUmKJUTAMemSKFzyQjSBN_-XyE'
    })
    .then(s => {
      console.debug('Successfully registered for push messages', 'subscription-data' + JSON.stringify(s.toJSON()));
      this.registration = s;
    },
    err => {
      console.error('error registering for push', err);
    });

    this.swPush.messages.subscribe(push => {
      console.debug('received push message', push);
    });

  }

  unregisterPush() {
    this.registration.unsubscribe().then(success => {
      console.debug('unsubscribed', success);
    })
  }

  setupUpdates() {
    this.swUpdate.available.subscribe(u => {
      this.swUpdate.activateUpdate().then(e => {
        this.snackBar.open("App updated -- please reload!", "OK");
      });
    });

    // this.swUpdate.activated.subscribe(u => console.debug('activated', u));
    this.swUpdate.checkForUpdate();

  }

  checkForUpdate() {
    this.swUpdate.checkForUpdate();
  }

}
