import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private readonly baseUrl = 'https://virtustrike.com/virtustrike-management-api-local';

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}
