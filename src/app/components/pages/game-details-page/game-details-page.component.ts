import {Component,OnInit,ViewChildren,QueryList,ElementRef,AfterViewInit} from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from 'src/app/service/game-servise';

@Component({
  selector: 'app-game-details-page',
  templateUrl: './game-details-page.component.html',
  styleUrls: ['./game-details-page.component.scss']
})
export class GameDetailsPageComponent implements OnInit {
  game: any;
  mediaSlides: string[] = [];
  showLoginModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.fetchGame(+gameId);
    }
  }

  fetchGame(id: number): void {
    this.gameService.getGameById(id).subscribe({
      next: (res) => {
        this.game = res.data;
        console.log('Game data:', this.game);


        // Media slides: add image and video if available
        this.mediaSlides = [];
        if (this.game.image_url) {
          this.mediaSlides.push(this.game.image_url);
        }
        if (this.game.video_url) {
          this.mediaSlides.push(this.game.video_url);
        }

        console.log('Game data:', this.game);
        console.log('Final mediaSlides:', this.mediaSlides);
      },
      error: (err) => {
        console.error('Error fetching game:', err);
      }
    });
  }

  getImageUrl(url: string): string {
    return url;
  }

  getVideoUrl(url: string): string {
    return url;
  }

  forceMute(videoElement: HTMLVideoElement): void {
    if (videoElement) {
      videoElement.muted = true;
    }
  }

  isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');

      if (!user?.userId || !token) {
        return false;
      }

      // Decode JWT token expiry
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) return false;

      const payload = JSON.parse(atob(payloadBase64));
      const exp = payload.exp ? payload.exp * 1000 : 0;
      const now = Date.now();

      if (exp && now > exp) {
        // Token expired => logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Token check failed', err);
      return false;
    }
  }


  handleBooking(): void {
    if (!this.isLoggedIn()) {
      this.showLoginModal = true;
      return;
    }
    const qp = {
      gameId: this.game.id,
      name: this.game.name,
      minPlayers: this.game.minPlayers,
      maxPlayers: this.game.maxPlayers,
      price: this.game.pricePerPlayer || this.game.pricePerHour || 0
    };
    this.router.navigate(['/booking'], { queryParams: qp });
  }

  navigateToLogin(): void {
    this.showLoginModal = false;
    setTimeout(() => this.router.navigate(['/sign-in']), 100);
  }
}  