import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';
import { RestResponse } from '../models/rest-response.model';
import { Center } from '../models/center.model';

@Injectable({
    providedIn: 'root'
})
export class CenterService {
    constructor(private http: HttpClient, private urlService: UrlService) { }

    getAllCenters(): Observable<RestResponse<Center[]>> {
        const url = `${this.urlService.getBaseUrl()}/admin/center/all`; 
        return this.http.get<RestResponse<Center[]>>(url);
    }
}