import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlService } from './url-service';
import { environment } from 'src/environments/environment';

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

    // GET ALL GAMES FOR USERS (with pagination)
    getAllGamesUser(page: number = 0, size: number = 10): Observable<any> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);
        return this.http.get(`${this.baseUrl}/FindAllGamesUser`, { params });
    }

    // GET GAME BY ID
    getGameById(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/FindById/${id}`);
    }

    // UPDATE GAME WITH MEDIA
    updateGameWithMedia(formData: FormData): Observable<any> {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`);

        return this.http.put(`${this.baseUrl}/updateWithMedia`, formData, { headers });
    }

    // S3 IMAGE URL
    getImageUrl(fileName: string): string {
        return `${environment.s3BaseUrl}/GameImages/${fileName}`;
    }

    // S3 VIDEO URL
    getVideoUrl(fileName: string): string {
        return `${environment.s3BaseUrl}/GameVideos/${fileName}`;
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