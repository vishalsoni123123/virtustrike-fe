import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    this.baseUrl = `${this.urlService.getBaseUrl()}/contactUs`;
  }

  // Add new contact
  addContact(contactData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddContact`, contactData);
  }

  // Get all contacts (paginated)
  getAllContacts(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.post(`${this.baseUrl}/findAllContact`, null, { params });
  }

  // Get contact by ID
  updateStatusAndRemark(id: number, status: string, remark: string): Observable<any> {
    const params = new HttpParams()
      .set('status', status)
      .set('remark', remark || '');

    return this.http.put(`${this.baseUrl}/updateStatusAndRemark/${id}`, {}, { params });
  }
}