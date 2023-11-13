import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Models/AppState';
import { getOrderByIdRequest } from 'src/app/state/Order/Actions';
import { Observable, Subscription } from 'rxjs';
import { OrderService } from 'src/app/state/Order/order.service';
import { PaymentService } from 'src/app/state/Payment/payment.service';

import * as emailjs from 'emailjs-com';

declare var paypal: any;
declare module 'emailjs-com';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit, OnDestroy {
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;
  private paypalButtonInitialized = false;

  order$!: Observable<any>;
  paidFor = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    // Initialize EmailJS
    emailjs.init("your_emailjs_user_id");

    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id);
      this.store.dispatch(getOrderByIdRequest({ orderId: id }));
    }
    this.order$ = this.store.select((store) => store.order.order);
    this.subscriptions.add(
      this.order$.subscribe((order) => {
        console.log('order from store - ', order);
      })
    );

    this.loadPaypalScript().then(() => {
      this.initializePayPalButton();
    }).catch(error => {
      console.error('PayPal script failed to load', error);
    });
  }

  private loadPaypalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=your_paypal_client_id';
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.body.appendChild(scriptElement);
    });
  }

  private initializePayPalButton(): void {
    this.subscriptions.add(
      this.order$.subscribe(order => {
        if (!this.paypalButtonInitialized && paypal) {
          this.paypalButtonInitialized = true;

          paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              const totalAmount = order.totalDiscountedPrice + 5;
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: totalAmount.toString()
                  }
                }]
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                alert('Transaction completed by ' + details.payer.name.given_name);
                this.paymentService.createPayment(order.id);
                this.sendConfirmationEmail(order, details);
              });
            }
          }).render('#paypal-button-container');
  
          this.subscriptions.unsubscribe();
        } else if (!paypal) {
          console.error("PayPal SDK not available.");
        }
      })
    );
  }

  private sendConfirmationEmail(order: any, paymentDetails: any) {
    const emailParams = {
      to_name: 'Recipient Name', // Replace with actual recipient's name
      from_name: 'Your Store Name', // Replace with your store's name
      order_id: order.id,
      shipping_address: `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}`, // Construct shipping address
      product_details: JSON.stringify(order.orderItems), // Convert product details to string
      transaction_id: paymentDetails.id
    };

    emailjs.send('your_service_id', 'your_template_id', emailParams)
      .then(response => console.log('Email sent successfully', response))
      .catch(error => console.error('Error sending email', error));
    }
  
    ngOnDestroy() {
      this.subscriptions.unsubscribe();
    }
  }
  
