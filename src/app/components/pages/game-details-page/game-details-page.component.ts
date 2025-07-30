import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../service/game-servise';

@Component({
  selector: 'app-game-details-page',
  templateUrl: './game-details-page.component.html',
  styleUrls: ['./game-details-page.component.scss']
})
export class GameDetailsPageComponent implements OnInit, AfterViewInit {
  game: any = null;
  selectedPlayers = 1;
  updatedPrice: number | null = null;
  showLoginModal = false;
  mediaSlides: string[] = [];

  @ViewChildren('gameVideo') gameVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.fetchGameById(+id);
    });
  }

  ngAfterViewInit(): void {
    this.gameVideos?.forEach(v => {
      v.nativeElement.muted = true;
      v.nativeElement.play().catch(() => {});
    });
  }

  fetchGameById(id: number): void {
    this.gameService.getGameById(id).subscribe({
      next: res => {
        this.game = res.data || res;
        if (this.game) {
          this.selectedPlayers = this.game.minPlayers || 1;
          this.updatePrice();
          this.setupMediaSlides();
        }
      },
      error: err => console.error(err)
    });
  }

  setupMediaSlides(): void {
    this.mediaSlides = [];
    if (Array.isArray(this.game.image_urls)) {
      this.mediaSlides.push(...this.game.image_urls);
    } else if (this.game.image_url) {
      this.mediaSlides.push(this.game.image_url);
    }
    if (this.game.video_url) {
      this.mediaSlides.push(this.game.video_url);
    }
  }

  updatePrice(): void {
    const { minPlayers, maxPlayers, pricePerPlayer, pricePerHour } = this.game;
    if (this.selectedPlayers < minPlayers) this.selectedPlayers = minPlayers;
    if (this.selectedPlayers > maxPlayers) this.selectedPlayers = maxPlayers;
    this.updatedPrice = pricePerPlayer
      ? this.selectedPlayers * pricePerPlayer
      : this.selectedPlayers * (pricePerHour || 0);
  }

  getImageUrl(path: string): string {
    return this.gameService.getImageUrl(path);
  }
  getVideoUrl(path: string): string {
    return this.gameService.getVideoUrl(path);
  }

  forceMute(video: HTMLVideoElement): void {
    video.muted = true;
    video.volume = 0;
  }

  isLoggedIn(): boolean {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return !!user?.userId;
    } catch {
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
      price: this.updatedPrice,
      minPlayers: this.game.minPlayers,
      maxPlayers: this.game.maxPlayers
    };
    this.router.navigate(['/booking'], { queryParams: qp });
  }

  navigateToLogin(): void {
    this.showLoginModal = false;
    setTimeout(() => this.router.navigate(['/sign-in']), 100);
  }
}
