import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestResponse } from '../models/rest-response.model';
import { BookingDetailResponseModel } from '../models/booking-details-response.model';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class BookingDetailsService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private urlService: UrlService
  ) {
    this.baseUrl = this.urlService.getBaseUrl();
  }

  // Method to add a booking
  getBookingById(id: number): Observable<RestResponse<BookingDetailResponseModel>> {
    return this.http.get<RestResponse<BookingDetailResponseModel>>(
      `${this.baseUrl}/admin/BookingDetails/${id}`
    );
  }

  getFilteredBookings(params: {
    centerId?: number;
    slotDate?: string;
    paymentStatus?: string;
    page?: number;
    size?: number;
    sortBy?: string;
  }): Observable<RestResponse<BookingDetailResponseModel[]>> {
    let httpParams = new HttpParams()
      .set('page', params.page?.toString() ?? '0')
      .set('size', params.size?.toString() ?? '10')
      .set('sortBy', params.sortBy ?? 'bookingDate');

    if (params.centerId !== undefined) {
      httpParams = httpParams.set('centerId', params.centerId.toString());
    }

    if (params.slotDate) {
      httpParams = httpParams.set('slotDate', params.slotDate);
    }

    if (params.paymentStatus) {
      httpParams = httpParams.set('paymentStatus', params.paymentStatus);
    }

    return this.http.get<RestResponse<BookingDetailResponseModel[]>>(
      `${this.baseUrl}/admin/BookingDetails/filter`,
      { params: httpParams }
    );
  }

  // Method to get all bookings with pagination
  getAllBookings(page: number, size: number): Observable<RestResponse<BookingDetailResponseModel[]>> {
    const httpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<RestResponse<BookingDetailResponseModel[]>>(
      `${this.baseUrl}/admin/BookingDetails/allBooking`,
      { params: httpParams }
    );
  }
}