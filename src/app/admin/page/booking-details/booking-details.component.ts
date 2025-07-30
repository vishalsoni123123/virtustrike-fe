import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingDetailResponseModel } from '../../../models/booking-details-response.model';
import { BookingDetailsService } from '../../../service/booking-details';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {
  bookings: BookingDetailResponseModel[] = [];
  page = 0;
  size = 10;
  totalItems = 0;

  constructor(
    private bookingService: BookingDetailsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchBookings(this.page);
  }

  fetchBookings(page: number): void {
    this.bookingService.getAllBookings(page, this.size).subscribe({
      next: (res) => {
        this.bookings = (res.data || []).map((booking: any) => ({
          ...booking,
          bookingDate: new Date(booking.bookingDate),
          slotDate: booking.slotDate ? new Date(booking.slotDate) : null
        }));
        this.totalItems = res.totalRecords || 0;
        this.page = res.pageNumber || 0;
      },
      error: (err) => {
        console.error('Error fetching bookings:', err);
      }
    });
  }

  previousPage(): void {
    if (this.page > 0) {
      this.fetchBookings(this.page - 1);
    }
  }

  nextPage(): void {
    if ((this.page + 1) * this.size < this.totalItems) {
      this.fetchBookings(this.page + 1);
    }
  }

  get totalPages(): number {
    return this.size > 0 ? Math.ceil(this.totalItems / this.size) : 1;
  }

  goToPage(index: number): void {
    this.fetchBookings(index);
  }

  viewDetails(id: number): void {
    this.router.navigate(['/admin/booking-details', id]);
  }
}