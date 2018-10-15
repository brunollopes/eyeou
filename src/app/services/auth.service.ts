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
          return { _id: null };
        }
      })
      .catch(err => err);
  }

  public myProfile() {
    return this.http.get('/auth/me')
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public updateMe($data) {
    return this.http.post('/users/me/update', $data)
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public login({ email, password }) {
    return this.http.post('/auth/login', { email, password })
      .toPromise()
      .then(user => {
        this.user = user;
        return user;
      })
      .catch(err => err);
  }

  public signup({ email, password }) {
    return this.http.post('/auth/signup', { email, password })
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public logout() {
    return this.http.get('/auth/logout')
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public resetPassword({ password, id, resetCode }) {
    return this.http.post('/auth/reset', { password, id, resetCode })
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public forgetPassword({ email }) {
    return this.http.post('/auth/forget', { email })
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }

  public location() {
    return this.http.get('/users/location')
      .toPromise()
      .then(res => res)
      .catch(err => err);
  }
}
