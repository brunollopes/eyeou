import { Component, OnInit, TemplateRef, NgZone, ViewChild, Inject } from "@angular/core";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ContestService } from "../../services/contest.service";
import { PaypalProvider } from "../../services/paypal.service";
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service';
import { resolve } from "../../../../node_modules/@types/q";

@Component({
  selector: "app-gallery-list",
  templateUrl: "./gallery-list.component.html",
  styleUrls: ["./gallery-list.component.css"]
})
export class GalleryListComponent implements OnInit {
  @ViewChild('template') ModelTemplate: TemplateRef<any>;

  public addScript: boolean = false;
  public finalAmount: number = 0;
  public hideNumbers: Boolean = false;
  public payed: Boolean = false;
  public contestId: string;
  public gallerylist: any[];
  public currentuser: any;
  public imgsrcArray: any;
  public listingDetails: any;
  public accescode: any;
  public contestName: string;
  public emailval: string;
  public errMsg: any;
  public accesVeirfy: Boolean = false;
  public paymentForm: FormGroup;
  public transactionChecked: Boolean

  constructor(
    public contestprovider: ContestService,
    public app: AppHelper,
    public translate: TranslateService,
    public dialog: MatDialog,
    public auth: AuthService
  ) { }

  // Open Modal
  openModal(listing) {
    if (this.auth.user) {
      this.dialog.open(ContestDialog, {
        width: '500px',
        data: listing
      })
    } else {
      this.app.openLoginDialog()
    }
  }

  // Get gallery data
  getContentData() {
    return new Promise((resolve, reject) => {
      this.contestprovider.getContests().then((data: Array<any>) => {
        this.gallerylist = data;
        this.gallerylist.forEach(gallery => {
          gallery.timeRemains = this.app.dateDiff(gallery.review_time)
          gallery.badge = this.app.getBadge(gallery.openphase_duration)
        })
        resolve(data)
      });
    })
  }

  ngOnInit() {
    this.getContentData()
  }

}


@Component({
  templateUrl: './contest-dialog.html',
  styleUrls: ["./gallery-list.component.css"]
})
export class ContestDialog implements OnInit {

  public payed: Boolean = false;
  public contestId: string;
  public gallerylist: any[];
  public currentuser: any;
  public paymentForm: FormGroup;
  public transactionChecked: Boolean;
  public clicked: Boolean = false;

  constructor(
    public paypalProvider: PaypalProvider,
    public dialogRef: MatDialogRef<ContestDialog>,
    public router: Router,
    public auth: AuthService,
    public fb: FormBuilder,
    public app: AppHelper,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  public checkTransaction(contestId) {
    return new Promise(async (resolve, reject) => {
      this.transactionChecked = false;
      this.payed = false;
      try {
        const transaction = await this.paypalProvider.CheckTransaction(contestId)
        transaction ? this.payed = true : this.payed = false;
        this.transactionChecked = true
        resolve(this.transactionChecked)
      } catch (e) {
        this.router.navigate(['/'])
      }
    })
  }

  public navigateToContestPage($slug) {
    this.dialogRef.close()
    this.router.navigate(['contest', $slug]);
  }

  submitform() {
    this.clicked = true;
    this.paymentForm.value.price = this.paymentForm.value.price.toString().substr(0, this.paymentForm.value.price.toString().indexOf('€'));
    this.paypalProvider.PayWithPaypal(this.paymentForm.value)
      .then(res => {
        window.location.href = res.approval_url;
      })
      .catch(err => { console.log(err) })
  }

  createForm() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['paypal'],
      term_condition: [null, Validators.requiredTrue],
      price: [null],
      contestId: [null]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public checkFees() {
    const photos = this.paymentForm.controls['photos'].value
    let price;
    switch (photos) {
      case "1":
        price = "2";
        break;
      case "10":
        price = "15";
        break;
      case "30":
        price = "35";
        break;
    }
    this.paymentForm.controls['price'].setValue(price + '€')
  }

  async ngOnInit() {
    this.createForm();
    try {
      const user = await this.auth.me()
      if (user._id) {
        this.contestId = this.data._id;
        this.paymentForm.controls['contestId'].setValue(this.contestId);
        const transaction = await this.checkTransaction(this.contestId);
        this.data.entry_price && !this.payed ? this.paymentForm.addControl('photos', new FormControl(null, Validators.required)) : this.paymentForm.removeControl('photos');
      } else {
        this.app.openLoginDialog()
      }
    } catch (e) {
      this.app.openLoginDialog()
    }
  }

}