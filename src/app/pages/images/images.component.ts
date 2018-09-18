import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.images = this.fullArray.chunk_inefficient(Math.floor(this.fullArray.length / this.widthContainer()))
  }

  public images: any;
  public fullArray: any;

  constructor(
    public router: Router,
    public contestProvider: ContestService,
    public translate: TranslateService,
    public helper: AppHelper,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.contestProvider.getImages()
      .then(res => {
        this.fullArray = res;
        this.images = res.chunk_inefficient(Math.floor(res.length / this.widthContainer()))
      })
      .catch(err => {
        this.router.navigate(['/'])
      })
  }

  openDialog(img): void {
    const dialogRef = this.dialog.open(ImageModal, {
      data: { src: img.thumbnail_path }
    });
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
    <img [src]="data.src" />
  `,
  styles: [

  ]
})
export class ImageModal {
  constructor(
    public dialogRef: MatDialogRef<ImageModal>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}