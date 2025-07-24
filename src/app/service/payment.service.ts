import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.baseUrl = this.urlService.getBaseUrl();
  }

  // Create Razorpay order
  createOrder(bookingDetailId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/payment/create`, null, {
      params: { bookingDetailId: bookingDetailId.toString() }
    });
  }

  // Handle payment success
  paymentSuccess(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/payment/success`, payload);
  }

  // Send Invoice
  sendInvoice(bookingId: number) {
  return this.http.post(`http://15.207.88.44:8080/api/billing/send-invoice/${bookingId}`, {}, { responseType: 'text' });
}

}
