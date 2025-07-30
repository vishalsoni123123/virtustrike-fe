import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private billingUrl = this.urlService.getBaseUrl() + '/billing';

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) {}

  sendInvoice(bookingId: number) {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.billingUrl}/send-invoice/${bookingId}`, null, {
      headers,
      responseType: 'text'
    });
  }
}