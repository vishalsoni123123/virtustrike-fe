import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../../service/payment.service';
import { BillingService } from '../../../service/billing.service'; 

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {
  bookingDetailId: number = 0;
  amount: number = 0;

  constructor(
    private paymentService: PaymentService,
    private billingService: BillingService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingDetailId = +params['bookingId'];
      this.amount = +params['amount'];

      console.log('bookingDetailId:', this.bookingDetailId);
      console.log('amount:', this.amount);

      if (!this.bookingDetailId || isNaN(this.bookingDetailId)) {
        alert('Invalid booking ID in URL!');
      }

      if (!this.amount || isNaN(this.amount)) {
        alert('Invalid amount in URL!');
      }
    });
  }

  payNow(): void {
    if (!this.bookingDetailId || isNaN(this.bookingDetailId)) {
      alert('Booking ID is missing or invalid!');
      return;
    }

    this.paymentService.createOrder(this.bookingDetailId).subscribe(
      order => {
        console.log('Order created:', order);

        const options: any = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'VirtuStrike Gaming',
          description: 'Booking Payment',
          order_id: order.orderId,
          handler: (response: any) => {
            console.log('Razorpay response:', response);

            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetailId: this.bookingDetailId
            };

            console.log('Sending payment payload:', payload);

            this.paymentService.paymentSuccess(payload).subscribe(
              () => {
                alert('🎉 Payment Successful & Saved!');

                // Send Invoice Email via BillingService
                this.billingService.sendInvoice(this.bookingDetailId).subscribe({
                  next: (res) => {
                    console.log('Invoice sent:', res);
                  },
                  error: (err) => {
                    console.error('Failed to send invoice:', err);
                  }
                });

                // Redirect to homepage after 3 sec
                setTimeout(() => {
                  window.location.href = '';
                }, 3000);
              },
              () => {
                alert('⚠️ Payment successful, but saving failed!');
              }
            );
          },
          theme: {
            color: '#1e88e5'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      error => {
        console.error('Failed to create order:', error);
        alert('Failed to create Razorpay order');
      }
    );
  }
}
