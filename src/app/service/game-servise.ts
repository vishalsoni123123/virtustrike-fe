import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private baseUrl: string;

    constructor(private http: HttpClient, private urlService: UrlService) {
        this.baseUrl = `${this.urlService.getBaseUrl()}/admin/game`;
    }

    // ADD GAME WITH PHOTOS
    addGameWithPhotos(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/addgameWithPhotos`, formData);
    }

    // GET ALL GAMES (with pagination)
    getAllGames(page: number = 0, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get(`${this.baseUrl}/FindAllGames`, { params });
    }

    // GET ALL GAMES USER (with pagination)
    getAllGamesUser(page: number = 0, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get(`${this.baseUrl}/FindAllGamesUser`, { params });
    }

    // GET FULL IMAGE URL (No double slashes)
    getImageUrl(filename: string): string {
        const base = this.urlService.getBaseUrl().replace(/\/+$/, '');
        const file = filename.replace(/^\/+/, '');
        return `${base}/${file}`;
    }

    // GET FULL VIDEO URL (similar to getImageUrl)
    getVideoUrl(filename: string): string {
        const base = this.urlService.getBaseUrl().replace(/\/+$/, '');
        const file = filename.replace(/^\/+/, '');
        return `${base}/${file}`;
    }

    // GET GAME BY ID
    getGameById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/FindById/${id}`);
    }

    // UPDATE GAME DETAILS
    updateGame(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // or however you store it
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(`${this.baseUrl}/update`, formData, { headers });
}


    // UPDATE GAME STATUS
    updateGameStatus(id: number, status: string): Observable<any> {
        const params = new HttpParams().set('status', status);
        return this.http.put(`${this.baseUrl}/status/${id}`, {}, { params });
    }

    // FILTER GAMES
    filterGames(
        centerId?: number,
        keyword?: string,
        status?: string,
        page: number = 0,
        size: number = 5,
        sortBy: string = 'createdAt',
        startdate?: number,
        enddate?: number,
        sortDir: string = 'desc'
    ): Observable<any> {
        let params = new HttpParams()
            .set('page', page)
            .set('size', size)
            .set('sortBy', sortBy)
            .set('sortDir', sortDir);

        if (centerId !== undefined) params = params.set('centerId', centerId);
        if (keyword) params = params.set('keyword', keyword);
        if (status) params = params.set('status', status);
        if (startdate !== undefined) params = params.set('startdate', startdate);
        if (enddate !== undefined) params = params.set('enddate', enddate);

        return this.http.get(`${this.baseUrl}/FindAllFilter`, { params });
    }
}