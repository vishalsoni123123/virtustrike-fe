import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    // Base URL for the Admin Dashboard API
    private BASE_URL: string;

    // DashboardService for Admin Module
    constructor(private http: HttpClient, private urlService: UrlService) {
        this.BASE_URL = `${this.urlService.getBaseUrl()}/admin/dashboard`;
    }

    // Total Users
    getTotalUsers(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/total-users`);
    }

    // Today's Registered Users
    getTodayUsers(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/todayUsers`);
    }

    // Recent Registered Users (for table display)
    getRecentUsers(page: number = 0, size: number = 5): Observable<any> {
        return this.http.get(`${this.BASE_URL}/recentUsers`, {
            params: {
                page: page.toString(),
                size: size.toString()
            }
        });
    }

    // Analytics Data for Bar Chart
    // Max Players Count
    getMaxPlayerCount(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/maxPlayerCount`);
    }
    // Revenue Summary 
    getRevenueSummary(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/analytics/revenue-summary`);
    }

    // Most Played Games 
    getMostPlayedGames(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/analytics/most-played-games`);
    }

    // Slot Booking Analytics
    getSlotBookingAnalytics(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/analytics/slot-bookings`);
    }

    // User Summary Stats (Played vs Registered)
    getUserPlaySummary(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/analytics/user-summary`);
    }
}