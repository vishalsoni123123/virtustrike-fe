import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';
import { BookingDetailResponseModel } from '../models/booking-details-response.model';
import { AddBookingModelRequest } from '../models/add-booking-model-request.model';
import { RestResponse } from '../models/rest-response.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.apiUrl = `${this.urlService.getBaseUrl()}/admin/BookingDetails`;
  }

  addBooking(request: AddBookingModelRequest): Observable<RestResponse<BookingDetailResponseModel>> {
    return this.http.post<RestResponse<BookingDetailResponseModel>>(`${this.apiUrl}/add`, request);
  }
}