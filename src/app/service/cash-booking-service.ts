import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class CashBookingService {

  private readonly apiUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    
    // Build base URL using UrlService
    this.apiUrl = `${this.urlService.getBaseUrl()}/admin/cash-bookings`;
  }

  // Add a new cash booking
  addBooking(booking: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, booking);
  }

  
  // Fetch all cash bookings
  getAllBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Fetch a single booking by ID
  getBookingById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}