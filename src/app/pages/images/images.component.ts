import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ContestService } from '../../services/contest.service';
import { TranslateService } from '../../services/translate.service';
import { AppHelper } from '../../services/app.helper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.images = this.fullArray.chunk_inefficient(Math.ceil(this.fullArray.length / this.widthContainer()))
  }

  public images: any;
  public fullArray: any;

  bsModalRef: BsModalRef;
  constructor(
    public router: Router,
    public contestProvider: ContestService,
    public translate: TranslateService,
    public helper: AppHelper,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.contestProvider.getImages()
      .then(res => {
        this.fullArray = res;
        this.images = res.chunk_inefficient(Math.ceil(res.length / this.widthContainer()))
      })
      .catch(err => {
        this.router.navigate(['/'])
      })
  }

  openDialog(img): void {
    localStorage.setItem('src', img.thumbnail_path)
    this.bsModalRef = this.modalService.show(ImageModal)
  }

  coolPhoto(id, i, $i) {
    this.images[i][$i].cooling = false

    if (!this.images[i][$i].cooling) {
      this.images[i][$i].cooling = true
      this.contestProvider.coolImage(id)
        .then(info => {
          if (info.status === 403) {
            if (info.error.message == 'Authorization Error: User is not logged in') {
              this.helper.openLoginDialog()
            }
          } else {
            this.images[i][$i].cooling = false
            if (info.status) {
              this.images[i][$i].userCooled = true
              this.images[i][$i].cools.push(true)
            } else {
              this.images[i][$i].userCooled = false
              this.images[i][$i].cools.pop()
            }
          }
        })
        .catch(err => {
          console.log('>> ERR:', err)
        })
    }
  }

  widthContainer() {
    const width = window.innerWidth;
    if (width >= 1200) {
      return 4;
    } else if (width < 1200 && width >= 992) {
      return 3;
    } else if (width < 9920 && width >= 768) {
      return 2;
    } else {
      return 1;
    }
  }

}

@Component({
  template: `
    <div style="max-width: 1200px; min-width: 600px">
      <img [src]="data.src" style="width: 100%"/>
    </div>
  `,
  styles: [
  ]
})
export class ImageModal implements OnInit {
  public data: any = {}

  constructor(
    public bsModalRef: BsModalRef
  ) {
  }

  onNoClick(): void {
    this.bsModalRef.hide()
  }

  ngOnInit() {
    this.data.src = localStorage.getItem('src')
  }
}