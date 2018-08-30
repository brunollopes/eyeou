import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../services/translate.service'
import { PaypalProvider } from "../../services/paypal.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

  constructor(
    public paypalProvider: PaypalProvider,
    public router: Router,
    public translate: TranslateService
  ) { }

  async ngOnInit() {
    let url = new URL(window.location.href),
      paymentId = url.searchParams.get('paymentId'),
      token = url.searchParams.get('token'),
      PayerID = url.searchParams.get('PayerID'),
      items = [{
        price: localStorage.getItem('price')
      }];
    const contest = localStorage.getItem('contestId')

    if (paymentId && token && PayerID) {
      this.paypalProvider.ExecutePayment({
        PayerID, paymentId, items, contest
      })
        .then(res => {
          this.router.navigate(['contest', res.contestUpdate.slug])
        })
        .catch(err => console.log(err))
    } else {
      this.router.navigate(['/'])
    }
  }

}
