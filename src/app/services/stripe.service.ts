import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor(public http: HttpClient) { }

  public pay({ token, amount, maxPhotosLimit, contest }) {
    return this.http.post('/stripe/pay', { token, amount, maxPhotosLimit, contest })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }
}
