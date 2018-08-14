import { Injectable } from '@angular/core';
import { Http } from '@angular/http'

@Injectable()
export class PaypalProvider {
  constructor(public http: Http) {}

  public PayWithPaypal({name, sku, price, currency, quantity}): Promise<any> {
    return this.http.post(
      '/paypal/pay',
      {items: [{name, sku, price, currency, quantity}]}
    )
    .toPromise()
    .then((res:any) => JSON.parse(res._body))
    .catch(err => err)
  }

  public ExecutePayment({ PayerID, paymentId, items, user, contest }) {
    return this.http.post(
      '/paypal/exec',
      {
        PayerID, paymentId, items, user, contest
      })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  public CheckTransaction({user, contest}) {
    return this.http.get(`/paypal/check/${user}/${contest}`)
    .toPromise()
    .then(res => res)
    .catch(err => err)
  }
}