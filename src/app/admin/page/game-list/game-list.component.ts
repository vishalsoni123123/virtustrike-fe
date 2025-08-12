import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/service/game-servise';

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

  selectedImageFile: File | null = null;
  selectedVideoFile: File | null = null;

  message: string = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.getAllGames();
  }

  getAllGames(): void {
    this.loading = true;
    this.gameService.getAllGames(this.currentPage, this.pageSize).subscribe({
      next: (res: any) => {
        const gameList = res?.data || [];
        this.games = gameList.map((game: any) => ({
          ...game,
          imageUrl: Array.isArray(game.image_url)
            ? game.image_url.map((img: string) => img.startsWith('http') ? img : this.gameService.getImageUrl(img))
            : game.image_url
              ? [game.image_url.startsWith('http') ? game.image_url : this.gameService.getImageUrl(game.image_url)]
              : [],
          videoUrl: Array.isArray(game.video_url)
            ? game.video_url.map((vid: string) => vid.startsWith('http') ? vid : this.gameService.getVideoUrl(vid))
            : game.video_url
              ? [game.video_url.startsWith('http') ? game.video_url : this.gameService.getVideoUrl(game.video_url)]
              : []
        }));

        this.totalRecords = res?.totalRecords || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.message = 'Error fetching games.';
        this.messageType = 'error';
        setTimeout(() => this.clearMessage(), 3000);
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
    this.selectedGame = { ...game };  
    this.previewUrls = [];

    this.selectedImageFile = null;
    this.selectedVideoFile = null;
  }

  backToList(): void {
    this.selectedGame = null;
    this.previewUrls = [];
    this.selectedImageFile = null;
    this.selectedVideoFile = null;
  }

  updateGameStatus(game: any): void {
    this.gameService.updateGameStatus(game.id, game.status).subscribe({
      next: () => {
        this.message = `Game ID ${game.id} status updated to ${game.status}.`;
        this.messageType = 'success';
        setTimeout(() => this.clearMessage(), 3000);
      },
      error: () => {
        this.message = 'Error updating game status.';
        this.messageType = 'error';
        setTimeout(() => this.clearMessage(), 3000);
      }
    });
  }

  clearMessage(): void {
    this.message = '';
    this.messageType = '';
  }

  onImageSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedImageFile = files[0];
      this.previewUrls = [];

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewUrls.push(reader.result.toString());
        }
      };
      reader.readAsDataURL(this.selectedImageFile);
    }
  }

  onVideoSelected(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      this.selectedVideoFile = files[0];
      this.previewUrls = [];

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.previewUrls.push(reader.result.toString());
        }
      };
      reader.readAsDataURL(this.selectedVideoFile);
    }
  }

  forceMute(event: Event): void {
    const videoElement = event.target as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.volume = 0;
    }
  }

  isImage(url: string): boolean {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  }

  isVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(url);
  }

  updateGame(): void {
    if (!this.selectedGame) return;

    const updatedGame = { ...this.selectedGame };

    // Ensure imageUrl is always an array
    if (updatedGame.imageUrl) {
      if (typeof updatedGame.imageUrl === 'string') {
        updatedGame.imageUrl = [updatedGame.imageUrl];
      }
    } else {
      updatedGame.imageUrl = [];
    }

    // Ensure videoUrl is always an array
    if (updatedGame.videoUrl) {
      if (typeof updatedGame.videoUrl === 'string') {
        updatedGame.videoUrl = [updatedGame.videoUrl];
      }
    } else {
      updatedGame.videoUrl = [];
    }

    updatedGame.image_url = updatedGame.imageUrl.length > 0 ? updatedGame.imageUrl[0] : null;
    updatedGame.video_url = updatedGame.videoUrl.length > 0 ? updatedGame.videoUrl[0] : null;

    // Remove frontend-only properties to avoid confusion
    delete updatedGame.imageUrl;
    delete updatedGame.videoUrl;

    const imageFile = this.selectedImageFile ?? undefined;
    const videoFile = this.selectedVideoFile ?? undefined;

    this.gameService.updateGameWithMedia(updatedGame, imageFile, videoFile).subscribe({
      next: (res: any) => {
        this.message = `Game ID ${updatedGame.id} updated successfully.`;
        this.messageType = 'success';
        setTimeout(() => this.clearMessage(), 3000);

        const updatedData = res.data;
        const index = this.games.findIndex(g => g.id === updatedGame.id);
        if (index !== -1) {
          this.games[index] = {
            ...updatedData,
            imageUrl: updatedData.image_url?.startsWith('http')
              ? updatedData.image_url
              : this.gameService.getImageUrl(updatedData.image_url),
            videoUrl: updatedData.video_url?.startsWith('http')
              ? updatedData.video_url
              : this.gameService.getVideoUrl(updatedData.video_url)
          };
        }

        this.backToList();
      },
      
      error: () => {
        this.message = 'Error updating game.';
        this.messageType = 'error';
        setTimeout(() => this.clearMessage(), 3000);
      }
    });
  }
}