import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any
  constructor(public http: HttpClient) { }

  public me() {
    return this.http.get('/auth/me')
      .toPromise()
      .then(user => {
        if (user) {
          this.user = user;
          return user;
        } else {
          this.user = null;
          return null;
        }
      })
      .catch(err => err);
  }

  public logout() {
    return this.http.get('/auth/logout')
      .toPromise()
      .then(res => res)
      .catch(res => res);
  }
}
