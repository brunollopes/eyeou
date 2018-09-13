import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';
import { TranslateService } from '../../services/translate.service';
import { AppHelper } from '../../services/app.helper';

Object.defineProperty(Array.prototype, 'chunk_inefficient', {
  value: function (chunkSize) {
    var array = this;
    return [].concat.apply([],
      array.map(function (elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  private images: any;
  private cooling: boolean = false;

  constructor(
    public router: Router,
    public contestProvider: ContestService,
    public translate: TranslateService,
    public helper: AppHelper
  ) { }

  ngOnInit() {
    this.contestProvider.getImages()
      .then(res => {
        this.images = res.chunk_inefficient(Math.ceil(res.length / 4))
      })
      .catch(err => {
        this.router.navigate(['/'])
      })
  }

  coolPhoto(id, i, $i) {
    this.images[i][$i].cooling = false
    
    if (!this.images[i][$i].cooling) {
      this.images[i][$i].cooling = true
      this.contestProvider.coolImage(id)
        .then(info => {
          if (info.status === 403) {
            if (info.error.message == 'User already cooled this image') {
              return;
            } else if (info.error.message == 'Authorization Error: User is not logged in') {
              this.helper.openLoginDialog()
            }
          } else {
            this.images[i][$i].userCooled = true
            this.images[i][$i].cools.push(true)
            this.images[i][$i].cooling = false
          }
        })
        .catch(err => {
          console.log('>> ERR:', err)
        })
    }
  }

}
