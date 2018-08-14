import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiUrls } from '../../apiurls';
import "rxjs/add/operator/map";

@Injectable()
export class ContestService {

  baseUrl = ApiUrls.URL;
  headers;

  constructor(public httpClient: HttpClient) {
    this.headers = new Headers();
    this.headers.append("content-Type", "Application/json");
  }

  getContests() {
    return this.httpClient.get('/contests', { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  getAccesCode(data) {
    return this.httpClient.get('/users/email/' + data, { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  varifyCode({email, acess_code}) {
    console.log(email, acess_code)
    return this.httpClient.post('/users/verify', {email, acess_code}, { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

  uploadimages(data) {
    return this.httpClient.post('/images/uploads', data, { headers: this.headers })
      .toPromise()
      .then(res => res)
      .catch(err => err)
  }

}
