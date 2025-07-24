import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingDetailsService } from '../../../service/booking-details';
import { BookingDetailResponseModel } from '../../../models/booking-details-response.model';

@Component({
  selector: 'app-booking-detail-view',
  templateUrl: './booking-detail-view.component.html',
  styleUrls: ['./booking-detail-view.component.scss']
})
export class BookingDetailViewComponent implements OnInit {
  booking: (BookingDetailResponseModel & {
    bookingDate?: Date;
    slotDate?: Date;
    paidAt?: Date | null;
  }) | null = null;

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingDetailsService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id || isNaN(id)) {
      this.errorMessage = 'Invalid booking ID.';
      return;
    }

    this.bookingService.getBookingById(id).subscribe({
      next: (res) => {
        const bookingData = res?.data;

        if (bookingData) {
          this.booking = {
            ...bookingData,
            bookingDate: bookingData.bookingDate ? new Date(bookingData.bookingDate) : undefined,
            slotDate: bookingData.slotDate ? new Date(bookingData.slotDate) : undefined,
            paidAt: bookingData.paidAt ? new Date(bookingData.paidAt) : null
          };
        } else {
          this.errorMessage = 'No booking data found.';
        }
      },
      error: (err) => {
        console.error('Error loading booking:', err);
        this.errorMessage = 'Booking not found or server error.';
      }
    });
  }

  closeView(): void {
    window.history.back();
  }
}