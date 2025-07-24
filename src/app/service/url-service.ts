import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  private readonly baseUrl = 'http://15.207.88.44:8080/virtustrike-management-api-local';

  public getBaseUrl(): string {
    return this.baseUrl;
  }
}
