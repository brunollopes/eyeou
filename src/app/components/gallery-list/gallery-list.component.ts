import { Component, OnInit, TemplateRef, ViewChild, ChangeDetectorRef, ElementRef, Inject } from "@angular/core";
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ContestService } from "../../services/contest.service";
import { PaypalProvider } from "../../services/paypal.service";
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service';
import { StripeService } from '../../services/stripe.service'

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ShareButtons } from '@ngx-share/core';

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

  bsModalRef: BsModalRef;
  constructor(
    public contestprovider: ContestService,
    public app: AppHelper,
    public translate: TranslateService,
    public dialog: MatDialog,
    public auth: AuthService,
    private modalService: BsModalService,
    public share: ShareButtons
  ) { }

  // Open Modal
  openModal(listing) {
    if (this.auth.user) {
      localStorage.setItem('contestId', listing._id)
      this.bsModalRef = this.modalService.show(ContestDialog, { initialState: { data: listing } })
    } else {
      this.app.openLoginDialog()
    }
  }

  _isFinite(int) {
    return isFinite(int)
  }

  // Get gallery data
  getContentData() {
    return new Promise((resolve, reject) => {
      this.contestprovider.getContests().then(async (data: Array<any>) => {
        try {
          const sponsorContests = await this.contestprovider.sponsorContests('5c018389013f9c1ce46b8873')
          data.push(sponsorContests.contests[0])
        } catch(e) {
          console.log(e)
        }
        this.gallerylist = data;
        this.gallerylist.forEach(gallery => {
          gallery.timeRemains = this.app.dateDiff(gallery.review_time)
          gallery.badge = this.app.getBadge(gallery.openphase_duration)
          gallery.counter = 0
          gallery.share = false;
          gallery.enableShare = () => { gallery.share = true }
          gallery.setImage = () => { gallery.image = gallery.bgprofile_image[gallery.counter] }
          gallery.pickImage = () => {
            gallery.counter = gallery.counter + 1;
            gallery.counter == 3 ? gallery.counter = 0 : gallery.counter = gallery.counter;
            return gallery.counter
          }
          gallery.setImage()
          gallery.changeImage = () => {
            setInterval(() => {
              gallery.pickImage()
              gallery.setImage()
            }, 5000)
          }
          gallery.changeImage()
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
  public data: any = {};
  public paymentMethod;
  public voucherError;
  public loadingVoucher: Boolean = false

  _isFinite(int) {
    return isFinite(int)
  }

  constructor(
    public paypalProvider: PaypalProvider,
    public dialog: MatDialog,
    public router: Router,
    public auth: AuthService,
    public fb: FormBuilder,
    public app: AppHelper,
    public translate: TranslateService,
    public bsModalRef: BsModalRef
  ) { }

  onNoClick() {
    this.bsModalRef.hide()
  }

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
    this.bsModalRef.hide();
    // this.dialogRef.close()
    this.router.navigate(['contest', $slug]);
  }

  paymentMethodChange(value) {
    this.paymentMethod = value
    if (value == 'promoCode') {
      this.paymentForm.controls['price'].setValue('Free')
      this.paymentForm.controls['photos'].setValue('1')
      this.paymentForm.addControl('code', new FormControl(null, Validators.required))
    } else {
      this.paymentForm.controls['price'].reset()
      if (this.paymentForm.value.photos)
        this.checkFees()

      this.paymentForm.removeControl('code')
    }
  }

  submitform() {
    if (this.paymentForm.controls['paymentMethod']) {
      const paymentMethod = this.paymentForm.controls['paymentMethod'].value
      if (paymentMethod == 'Paypal') {
        this.clicked = true;
        this.paymentForm.value.price = this.paymentForm.value.price.toString().substr(0, this.paymentForm.value.price.toString().indexOf('€'));
        this.paypalProvider.PayWithPaypal(this.paymentForm.value)
          .then(res => {
            window.location.href = res.approval_url;
          })
          .catch(err => { console.log(err) })
      } else if (paymentMethod == 'CreditCard') {
        this.dialog.open(StripeModal, {
          width: '600px',
          data: {
            ...this.paymentForm.value,
            contestId: this.contestId
          }
        })
      } else if (paymentMethod == 'promoCode') {
        this.loadingVoucher = true
        this.paypalProvider.activateVoucher({ contestId: this.contestId, code: this.paymentForm.value.code })
          .then(res => {
            this.loadingVoucher = false
            if (res.error) {
              const errors = [
                "Código promocional inválido",
                "Já usou este código promocional",
                "Este código não pode ser usado novamente"
              ]
              if (this.translate.lang.langKey == 'pt') {
                if (res.error == 'You have already used this voucher') {
                  this.voucherError = errors[1]
                } else if (res.error == 'This voucher can not be used anymore') {
                  this.voucherError = errors[2]
                } else if (res.error == 'Invalid voucher code') {
                  this.voucherError = errors[0]
                }
              } else {
                this.voucherError = res.error
              }
            } else {
              this.voucherError = null
              location.href = `${location.origin}/contest/${res.slug}`
              this.bsModalRef.hide()
            }
          })
          .catch(err => {
            this.loadingVoucher = false
            console.log(err)
          })
      }
    }
  }

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      term_condition: [null, Validators.requiredTrue],
      price: [null],
      contestId: [null]
    });
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
    this.createPaymentForm();

    try {
      const user = await this.auth.me()
      if (user._id) {
        this.contestId = this.data._id;
        this.paymentForm.controls['contestId'].setValue(this.contestId);
        const transaction = await this.checkTransaction(this.contestId);
        if (this.data.entry_price && !this.payed) {
          this.paymentForm.addControl('photos', new FormControl(null, Validators.required))
          this.paymentForm.addControl('paymentMethod', new FormControl(null, Validators.required))
        } else {
          this.paymentForm.removeControl('photos')
          this.paymentForm.removeControl('paymentMethod')
        }
      } else {
        this.app.openLoginDialog()
      }
    } catch (e) {
      this.app.openLoginDialog()
    }
  }
}

@Component({
  template: `
    <form #checkout (ngSubmit)="onSubmit(checkout)" class="checkout" style="padding: 25px 20px">
      <div class="form-row">
        <h5 style="text-align: center; color: #0E282B; font-weight: 200; font-size: 22px; margin-bottom: 15px">{{translate.lang.cardInfo}}</h5>
        <div id="card-info" #cardInfo></div>
      </div>

      <div class='text-center'>
        <button 
          type="submit" 
          style="text-transform: uppercase"
          class="btn btn-success"
          [disabled]="loading">
          {{translate.lang.pay}}
        </button>
        <div class='alert alert-danger text-center' style='margin: 15px 0 0 0' id="card-errors" role="alert" *ngIf="error">{{ error }}</div>
        <mat-spinner *ngIf='loading' style="margin: 10px auto" diameter="15"></mat-spinner>
      </div>
    </form>
  `,
  styleUrls: ["./gallery-list.component.css"],
  providers: [ContestDialog]
})
export class StripeModal {

  @ViewChild('cardInfo') cardInfo: ElementRef;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  loading: boolean

  constructor(
    private cd: ChangeDetectorRef,
    public translate: TranslateService,
    public stripe: StripeService,
    public dialogRef: MatDialogRef<StripeModal>,
    public router: Router,
    public contestDialog: ContestDialog,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);

    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      if (error.message === 'Your postal code is incomplete.') {
        this.error = this.translate.lang.incompletePostCode
      } else if (error.message === 'Your card\'s security code is incomplete.') {
        this.error = this.translate.lang.incompleteCVC
      } else if (error.message === 'Your card\'s expiration date is incomplete.') {
        this.error = this.translate.lang.incompleteExpDate
      } else if (error.message === 'Your card number is incomplete.') {
        this.error = this.translate.lang.incompleteCardNumber
      } else if (error.message === 'Your card number is invalid.') {
        this.error = this.translate.lang.invalidCardNumber
      } else {
        this.error = error.message
      }
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form) {
    this.loading = true
    this.error = null
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      this.loading = false
      this.error = this.translate.lang.paymentError
    } else {
      this.stripe.pay({ token, amount: this.data.price.replace('€', ''), maxPhotosLimit: this.data.photos, contest: this.data.contestId })
        .then(charge => {
          this.loading = false
          if (charge.paid) {
            location.href = `${location.origin}/contest/${charge.slug}`
          } else {
            if (charge.error === 'Must provide source or customer.') {
              this.error = this.translate.lang.invalidCardData
            } else if (charge.error === 'Your card has insufficient funds.') {
              this.error = this.translate.lang.fundsError
            } else {
              this.error = this.translate.lang.paymentError
            }
          }
        })
        .catch(error => {
          this.loading = false
        })
    }
  }
}