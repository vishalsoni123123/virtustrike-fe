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
  currentSlide = 0;
  mediaSlides: string[] = [];

  @ViewChildren('gameVideo') gameVideos!: QueryList<ElementRef<HTMLVideoElement>>;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('GameDetailsPageComponent loaded');

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) this.fetchGameById(+id);
    });
  }

  ngAfterViewInit(): void {
    this.gameVideos?.forEach((videoRef) => {
      videoRef.nativeElement.muted = true;
    });
  }

  fetchGameById(id: number): void {
    this.gameService.getGameById(id).subscribe({
      next: (response) => {
        this.game = response.data || response;
        console.log('Game data:', this.game);
        if (this.game) {
          this.selectedPlayers = this.game.minPlayers || 1;
          this.updatePrice();
          this.setupMediaSlides();
        }
      },
      error: (err) => console.error('Error loading game by ID:', err),
    });
  }

  setupMediaSlides(): void {
    this.mediaSlides = [];

    if (this.game.image_urls && Array.isArray(this.game.image_urls)) {
      this.mediaSlides.push(...this.game.image_urls);
    } else if (this.game.image_url) {
      this.mediaSlides.push(this.game.image_url);
    }

    if (this.game.video_url) {
      this.mediaSlides.push(this.game.video_url);
    }
  }

  updatePrice(): void {
    if (this.selectedPlayers < (this.game.minPlayers)) {
      this.selectedPlayers = this.game.minPlayers ;
    }

    if (this.selectedPlayers > this.game.maxPlayers) {
      this.selectedPlayers = this.game.maxPlayers;
    }

    if (this.game?.pricePerPlayer) {
      this.updatedPrice = this.selectedPlayers * this.game.pricePerPlayer;
    } else if (this.game?.pricePerHour) {
      this.updatedPrice = this.selectedPlayers * this.game.pricePerHour;
    }
  }

  getImageUrl(path: string): string {
    return this.gameService.getImageUrl(path);
  }

  getVideoUrl(path: string): string {
    return this.gameService.getVideoUrl(path);
  }

  forceMute(video: HTMLVideoElement): void {
    if (video && !video.muted) {
      video.muted = true;
      video.volume = 0;
    }
  }

  isLoggedIn(): boolean {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return false;
      const user = JSON.parse(userString);
      return !!user?.userId;
    } catch {
      return false;
    }
  }

  handleBooking(): void {
    if (!this.isLoggedIn()) {
      this.showLoginModal = true;
    } else {
      const queryParams = {
        gameId: this.game?.id,
        name: this.game?.name,
        price: this.updatedPrice,
        minPlayers: this.game?.minPlayers,
        maxPlayers: this.game?.maxPlayers,
      };

      console.log('Navigating to booking with queryParams:', queryParams);

      this.router.navigate(['/booking'], { queryParams });
    }
  }

  navigateToLogin(): void {
    this.showLoginModal = false;
    setTimeout(() => {
      this.router.navigate(['/sign-in']);
    }, 100);
  }

  prevSlide(): void {
    if (this.currentSlide > 0) this.currentSlide--;
  }

  nextSlide(): void {
    if (this.currentSlide < this.mediaSlides.length - 1) this.currentSlide++;
  }
}