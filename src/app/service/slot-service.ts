// src/app/services/slot.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Slot } from '../models/slot.model';
import { UrlService } from './url-service';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  private baseUrl: string;

  constructor(private http: HttpClient, private urlService: UrlService) {
    // Base URL
    this.baseUrl = this.urlService.getBaseUrl() + '/admin/slot';
  }

  // Get All Slots
  getAllSlots(): Observable<{ data: Slot[] }> {
    return this.http.get<{ data: Slot[] }>(`${this.baseUrl}/all`);
  }

  // Get Slot By ID
  getSlotById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Add Slot
  addSlot(slotData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, slotData);
  }

  // Update Slot
  updateSlot(slot: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update`, slot);
  }

  // Delete Slot
  deleteSlot(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}