import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CashBookingService } from 'src/app/service/cash-booking-service';

@Component({
  selector: 'app-cash-booking',
  templateUrl: './cash-booking.component.html',
  styleUrls: ['./cash-booking.component.scss']
})
export class CashBookingComponent implements OnInit {
  bookingForm!: FormGroup;
  bookings: any[] = [];
  paginatedBookings: any[] = [];
  selectedBooking: any = null;
  showForm: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  // Pagination variables
  page: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private fb: FormBuilder, private cashBookingService: CashBookingService) { }

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gameName: ['', Validators.required],
      players: [, [Validators.required, Validators.min(1)]],
      price: [, [Validators.required, Validators.min(1)]],
      slotTiming: ['', Validators.required],
      paymentMode: ['', Validators.required]
    });

    this.getAllBookings();
  }

  getAllBookings(): void {
    this.cashBookingService.getAllBookings().subscribe({
      next: (response) => {
        this.bookings = response.data || response;
        this.bookings.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.totalPages = Math.ceil(this.bookings.length / this.pageSize);
        this.updatePaginatedBookings();
      },
      error: (err) => {
        this.errorMessage = 'Error fetching bookings. Please try again later.';
        // console.error('Error fetching bookings:', err);
      }
    });
  }

  updatePaginatedBookings(): void {
    const start = this.page * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedBookings = this.bookings.slice(start, end);
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.updatePaginatedBookings();
    }
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.updatePaginatedBookings();
    }
  }

  goToPage(pageNumber: number): void {
    this.page = pageNumber;
    this.updatePaginatedBookings();
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      this.cashBookingService.addBooking(this.bookingForm.value).subscribe({
        next: (response) => {
          this.successMessage = 'Booking added successfully!';
          this.errorMessage = '';
          this.bookingForm.reset();
          this.showForm = false;
          this.getAllBookings();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Failed to add booking. Please try again.';
          this.successMessage = '';
          // console.error('Error adding booking:', err);

          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  getBookingById(id: number): void {
    this.cashBookingService.getBookingById(id).subscribe({
      next: (response) => {
        this.selectedBooking = response.data || response;
      },
      error: (err) => {
        this.errorMessage = 'Error fetching booking details.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        // console.error('Error fetching booking:', err);
      }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.selectedBooking = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.bookingForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }

  clearSelectedBooking(): void {
    this.selectedBooking = null;
  }
}