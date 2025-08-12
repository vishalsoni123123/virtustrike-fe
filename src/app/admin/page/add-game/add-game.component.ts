import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss'],
})
export class AddGameComponent {
  game = {
    name: '',
    description: '',
    story: '',
    pricePerHour: null as number | null,
    minPlayers: null as number | null,
    maxPlayers: null as number | null,
    centerId: null as number | null,
    imageFiles: [] as File[],
    videoFile: null as File | null,
  };

  previewUrls: string[] = [];
  isSubmitting = false;

  message: string = '';
  isSuccess: boolean = false;

  constructor(private http: HttpClient) { }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.game.imageFiles = Array.from(input.files);
    this.previewUrls = [];

    this.game.imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.previewUrls.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.game.videoFile = input.files[0];
    }
  }

  addGame(): void {
    if (!this.isFormValid()) {
      this.showMessage('Please fill in all required fields with valid values.', false);
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();

    const data = {
      name: this.game.name.trim(),
      description: this.game.description.trim(),
      story: this.game.story.trim(),
      pricePerHour: this.game.pricePerHour,
      minPlayers: this.game.minPlayers,
      maxPlayers: this.game.maxPlayers,
      centerId: this.game.centerId,
    };

    const encodedData = encodeURIComponent(JSON.stringify(data));

    this.game.imageFiles.forEach((file) => {
      formData.append('gameImageFiles', file);
    });

    if (this.game.videoFile) {
      formData.append('gameVideoFile', this.game.videoFile);
    }

    this.http
      .post(
        `https://virtustrike.com/virtustrike-management-api-local/admin/game/addgameWithPhotos?GameAddRequestModelJson=${encodedData}`,
        formData
      )
      .subscribe({
        next: (response: any) => {
          this.showMessage('Game added successfully!', true);
          console.log('Server response:', response);
          this.resetForm();
        },
        error: (err) => {
          console.error('Error response:', err);
          if (err.status === 400) {
            this.showMessage('Bad Request: Please check your input data.', false);
          } else if (err.status === 500) {
            this.showMessage('Server error: Please try again later.', false);
          } else {
            this.showMessage('Failed to add game. Please try again.', false);
          }
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
  }

  isFormValid(): boolean {
    const {
      name,
      description,
      story,
      pricePerHour,
      minPlayers,
      maxPlayers,
      centerId,
    } = this.game;

    return (
      name.trim().length > 0 &&
      description.trim().length > 0 &&
      story.trim().length > 0 &&
      typeof pricePerHour === 'number' &&
      pricePerHour > 0 &&
      typeof minPlayers === 'number' &&
      minPlayers > 0 &&
      typeof maxPlayers === 'number' &&
      maxPlayers > 0 &&
      typeof centerId === 'number' &&
      centerId > 0
    );
  }

  resetForm(): void {
    this.game = {
      name: '',
      description: '',
      story: '',
      pricePerHour: null,
      minPlayers: null,
      maxPlayers: null,
      centerId: null,
      imageFiles: [],
      videoFile: null,
    };
    this.previewUrls = [];

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      (input as HTMLInputElement).value = '';
    });
  }

  showMessage(msg: string, success: boolean) {
    this.message = msg;
    this.isSuccess = success;

    setTimeout(() => {
      this.message = '';
    }, 4000);
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const activeElement = document.activeElement as HTMLInputElement;
    if (activeElement && activeElement.type === 'number') {
      activeElement.blur();
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const activeElement = document.activeElement as HTMLInputElement;
    if (
      activeElement &&
      activeElement.type === 'number' &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      event.preventDefault();
    }
  }
}
