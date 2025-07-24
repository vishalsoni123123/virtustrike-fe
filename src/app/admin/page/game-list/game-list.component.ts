import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../service/game-servise';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalRecords: number = 0;
  loading: boolean = false;
  selectedGame: any = null;
  previewUrls: string[] = [];

  constructor(public gameService: GameService) {}

  ngOnInit(): void {
    this.getAllGames();
  }

  getAllGames(): void {
    this.loading = true;
    this.gameService.getAllGames(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        const gameList = res?.data || [];
        this.games = gameList.map((game: any) => ({
          ...game,
          imageUrl: game.image_url ? this.gameService.getImageUrl(game.image_url) : null,
          videoUrl: game.video_url ? this.gameService.getVideoUrl(game.video_url) : null
        }));
        this.totalRecords = res?.totalRecords || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching games:', err);
        this.loading = false;
      }
    });
  }

  onPageChange(direction: 'prev' | 'next'): void {
    const maxPage = Math.ceil(this.totalRecords / this.pageSize) - 1;
    if (direction === 'prev' && this.currentPage > 0) {
      this.currentPage--;
      this.getAllGames();
    } else if (direction === 'next' && this.currentPage < maxPage) {
      this.currentPage++;
      this.getAllGames();
    }
  }

  viewGame(game: any): void {
    this.selectedGame = game;
    this.previewUrls = []; 
  }

  backToList(): void {
    this.selectedGame = null;
    this.previewUrls = [];
  }

  updateGameStatus(game: any): void {
    this.gameService.updateGameStatus(game.id, game.status).subscribe({
      next: () => {
        alert(`Game ID ${game.id} status updated to ${game.status}`);
      },
      error: (err) => {
        console.error('Failed to update game status:', err);
        alert('Error updating game status.');
      }
    });
  }

  onImageSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            this.previewUrls.push(reader.result.toString());
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onVideoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewUrls.push(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  }

  forceMute(event: Event) {
  const videoElement = event.target as HTMLVideoElement;
  if (videoElement) {
    videoElement.muted = true;
    videoElement.volume = 0;
  }
}

  isImage(url: string): boolean {
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  }

  isVideo(url: string): boolean {
    return url.match(/\.(mp4|webm|ogg)$/i) != null;
  }

  updateGame(): void {
    // Implement your game update logic here
    alert('Game update functionality not implemented yet.');
  }
}
