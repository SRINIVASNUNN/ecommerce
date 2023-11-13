

  import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/Models/AppState';
import { getOrderByIdRequest } from 'src/app/state/Order/Actions';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/state/Order/order.service';
import { PaymentService } from 'src/app/state/Payment/payment.service';

declare var paypal: any;

@Component({
  selector: 'app-feture',
  templateUrl: './feture.component.html',
  styleUrls: ['./feture.component.scss']
})
export class FetureComponent  {
  



}

