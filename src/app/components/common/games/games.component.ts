import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../../../service/game-servise';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
    games: any[] = [];
    loading: boolean = false;

    constructor(private gameService: GameService, private router: Router) { }

    ngOnInit(): void {
        this.loadGames();
    }

    loadGames(): void {
        this.loading = true;
        this.gameService.getAllGamesUser(0, 20).subscribe({
            next: (res) => {
                const baseUrl = environment.backendBaseUrl;

                this.games = res.data.map((game: any) => ({
                    ...game,
                    fullImageUrl: game.image_url ? `${baseUrl}${game.image_url}` : null,
                    minPlayers: game.minPlayers ?? null,
                    maxPlayers: game.maxPlayers ?? null
                }));

                this.loading = false;
            },
            error: (err) => {
                console.error('Error fetching games:', err);
                this.loading = false;
            }
        });
    }

    viewGame(game: any): void {
        this.router.navigate(['/game', game.id]);
    }
}