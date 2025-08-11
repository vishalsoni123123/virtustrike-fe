import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../service/game-servise';
import { CenterService } from '../../../service/center-service';
import { SlotService } from '../../../service/slot-service';
import { BookingService } from '../../../service/booking-service';

@Component({
  selector: 'app-booking-page',
  templateUrl: './booking-page.component.html',
  styleUrls: ['./booking-page.component.scss']
})
export class BookingPageComponent implements OnInit {
  bookingForm: FormGroup;
  games: any[] = [];
  centers: any[] = [];
  availableSlots: any[] = [];
  availablePlayers: number[] = [];
  pricePerPlayer: number = 0;
  selectedGame: any = null;
  today: string = new Date().toISOString().split('T')[0];
  showSlotList: boolean = false;

  queryGameId: number = 0;
  queryPlayers: number = 0;
  queryPrice: number = 0;

  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private centerService: CenterService,
    private slotService: SlotService,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      gameId: [''],
      centerId: ['', Validators.required],
      slots: [[], Validators.required],
      player: ['', Validators.required],
      slotDate: [this.today, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listenToQueryParams();
    this.fetchGames();
    this.fetchCenters();
    this.fetchSlots();
  }

  listenToQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      this.queryGameId = +params['gameId'];
      this.queryPrice = +params['price'];
      const minPlayers = +params['minPlayers'] || 2;
      this.queryPlayers = minPlayers;

      if (this.queryGameId) {
        this.bookingForm.patchValue({ gameId: this.queryGameId });
      }

      if (this.queryPlayers) {
        this.bookingForm.patchValue({ player: this.queryPlayers });
      }

      if (this.queryPrice > 0 && this.queryPlayers > 0) {
        this.pricePerPlayer = this.queryPrice / this.queryPlayers;
      }
    });
  }

  fetchGames(): void {
    this.gameService.getAllGames().subscribe({
      next: res => {
        this.games = res.data || [];
        if (this.queryGameId) {
          this.setGameDetails(this.queryGameId);
        }
      },
      error: err => console.error('Error fetching games:', err)
    });
  }

  setGameDetails(gameId: number): void {
    const selectedGame = this.games.find(g => g.id === gameId);
    this.selectedGame = selectedGame;
    this.availablePlayers = [];

    if (selectedGame) {
      if (Array.isArray(selectedGame.allowedPlayers) && selectedGame.allowedPlayers.length > 0) {
        this.availablePlayers = selectedGame.allowedPlayers;
      } else {
        const min = selectedGame.minPlayers ?? 1;
        const max = selectedGame.maxPlayers ?? 6;

        for (let i = min; i <= max; i++) {
          if (min > 1) {
            if (i % 2 === 0) {
              this.availablePlayers.push(i);
            }
          } else {
            this.availablePlayers.push(i);
          }
        }
      }

      if (this.queryPrice > 0 && this.queryPlayers > 0) {
        this.pricePerPlayer = this.queryPrice / this.queryPlayers;
      } else if (selectedGame.pricePerPlayer > 0) {
        this.pricePerPlayer = selectedGame.pricePerPlayer;
      } else {
        this.pricePerPlayer = 0;
      }

      const selectedPlayers = +this.bookingForm.get('player')?.value;
      if (!this.availablePlayers.includes(selectedPlayers)) {
        this.bookingForm.patchValue({ player: this.availablePlayers[0] });
      }
    } else {
      this.availablePlayers = [];
      this.pricePerPlayer = 0;
    }
  }

  fetchCenters(): void {
    this.centerService.getAllCenters().subscribe({
      next: res => this.centers = res.data || [],
      error: err => console.error('Error fetching centers:', err)
    });
  }

  fetchSlots(): void {
    this.slotService.getAllSlots().subscribe({
      next: res => this.availableSlots = res.data || [],
      error: err => console.error('Error fetching slots:', err)
    });
  }
  toggleSlotSelection(slotId: number) {
    const currentSlots: number[] = this.bookingForm.get('slots')?.value || [];

    if (currentSlots.includes(slotId)) {
      const updated = currentSlots.filter(id => id !== slotId);
      this.bookingForm.get('slots')?.setValue(updated);
    } else {
      this.bookingForm.get('slots')?.setValue([...currentSlots, slotId]);
    }
  }

  isSlotSelected(slotId: number): boolean {
    return this.bookingForm.get('slots')?.value?.includes(slotId);
  }

  get totalPrice(): number {
    const players = +this.bookingForm.get('player')?.value || 0;
    const slots = this.bookingForm.get('slots')?.value || [];

    return players * this.pricePerPlayer * slots.length;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    const formValue = this.bookingForm.getRawValue();
    const bookingData = {
      ...formValue,
      gameId: this.queryGameId,
      totalPrice: this.totalPrice,
      userId: this.getUserIdFromStorage()
    };

    this.bookingService.addBooking(bookingData).subscribe({
      next: (res) => {
        const bookingDetailId = res?.data?.id;
        if (!bookingDetailId) {
          this.successMessage = 'Booking failed: No booking ID received.';
          return;
        }

        this.successMessage = '🎉 Your booking was successful! Redirecting to payment...';
        setTimeout(() => this.successMessage = '', 5000);
        this.resetForm();

        this.router.navigate(['/payment'], {
          queryParams: {
            bookingId: bookingDetailId,
            amount: bookingData.totalPrice,
            userId: bookingData.userId,
            gameId: bookingData.gameId,
            centerId: bookingData.centerId,
            slotDate: bookingData.slotDate
          }
        });
      },
      error: err => {
        console.error('Booking error:', err);
        this.successMessage = ' Booking failed. Please try again later.';
      }
    });
  }

  resetForm(): void {
    this.bookingForm.reset({
      gameId: '',
      centerId: '',
      slots: [],
      player: '',
      slotDate: this.today
    });
    this.pricePerPlayer = 0;
    this.availablePlayers = [];
    this.selectedGame = null;
  }

  getUserIdFromStorage(): number | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).userId : null;
    } catch (e) {
      console.error('Error reading user from storage:', e);
      return null;
    }
  }
}