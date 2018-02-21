import { Injectable } from '@angular/core';
import { Hotel } from './hotel';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SyncService } from '../sync/sync.service';
import { MatSnackBar } from '@angular/material';

const URL = 'http://www.angular.at/api/hotel';

@Injectable()
export class HotelService {

    constructor(
        private http: HttpClient,
        private syncService: SyncService,
        private snackBar: MatSnackBar
    ) { }

    findAll(): Observable<Hotel[]> {
        return this.http.get<Hotel[]>(URL);
    }
    
    save(hotel: Hotel): Observable<Hotel> {
        let headers = {
            'content-type': 'application/json'
        }
        return this.http.put<Hotel>(`${URL}/${hotel.id}/rating`, hotel, { headers });
    }

    async enqueueRating(hotel: Hotel) {
        let url = `${URL}/${hotel.id}/rating`;
        await this.sendToServiceWorker(hotel, url);
    }

    async sendToServiceWorker(hotel: Hotel, url: string) {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            await this.syncService.enqueue({
                method: 'PUT',
                payload: hotel,
                url: url
              });

           navigator.serviceWorker
              .ready
              .then(reg => {
                  return reg.sync.register('upload');
              })
              .catch(_ => {
                  console.error('Error requesting sync');
              });
        }
        else {
            this.save(hotel).subscribe(
                hotels => this.snackBar.open('Your rating has been saved! ', 'OK', { duration: 4000 }),
                err => this.snackBar.open('Error saving rating', null, { duration: 4000 })
            );
        }
    }
}