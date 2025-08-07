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
  statusMessage: string = '';
  statusType: 'success' | 'error' | 'info' = 'info';

  constructor(
    private paymentService: PaymentService,
    private billingService: BillingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookingDetailId = +params['bookingId'];
      this.amount = +params['amount'];

      if (!this.bookingDetailId || isNaN(this.bookingDetailId)) {
        this.showStatus('Invalid booking ID in URL!', 'error');
      }

      if (!this.amount || isNaN(this.amount)) {
        this.showStatus('Invalid amount in URL!', 'error');
      }
    });
  }

  showStatus(message: string, type: 'success' | 'error' | 'info') {
    this.statusMessage = message;
    this.statusType = type;
    setTimeout(() => this.statusMessage = '', 4000); // auto hide
  }

  payNow(): void {
    if (!this.bookingDetailId || isNaN(this.bookingDetailId)) {
      this.showStatus('Booking ID is missing or invalid!', 'error');
      return;
    }

    this.showStatus('Creating payment order...', 'info');

    this.paymentService.createOrder(this.bookingDetailId).subscribe(
      order => {
        const options: any = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'VirtuStrike Gaming',
          description: 'Booking Payment',
          order_id: order.orderId,
          handler: (response: any) => {
            const payload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingDetailId: this.bookingDetailId
            };

            this.showStatus('Processing payment...', 'info');

            this.paymentService.paymentSuccess(payload).subscribe(
              () => {
                this.showStatus('🎉 Payment Successful!', 'success');

                this.billingService.sendInvoice(this.bookingDetailId).subscribe({
                  next: () => console.log('Invoice sent'),
                  error: err => console.error('Invoice error:', err)
                });

                setTimeout(() => {
                  window.location.href = '';
                }, 3000);
              },
              () => {
                this.showStatus('Payment succeeded but saving failed!', 'error');
              }
            );
          },
          theme: { color: '#1e88e5' }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      },
      error => {
        console.error('Order creation failed:', error);
        this.showStatus('Failed to create Razorpay order', 'error');
      }
    );
  }
}