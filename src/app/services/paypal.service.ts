import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaypalProvider {
  constructor(public http: HttpClient) { }

  public PayWithPaypal({ name, sku, price, currency, quantity }): Promise<any> {
    return this.http.post(
      '/paypal/pay',
      { items: [{ name, sku, price, currency, quantity }] }
    )
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  public ExecutePayment({ PayerID, paymentId, items, contest }) {
    return this.http.post(
      '/paypal/exec',
      {
        PayerID, paymentId, items, contest
      })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  public CheckTransaction(contestId) {
    return this.http.get(`/paypal/check/${contestId}`)
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }
}