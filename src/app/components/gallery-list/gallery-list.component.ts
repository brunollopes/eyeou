import { Component, OnInit, TemplateRef, NgZone, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { FormGroup, FormBuilder, FormControl, Validators, EmailValidator } from "@angular/forms";
import { ContestService } from "../../services/contest.service";
import { PaypalProvider } from "../../services/paypal.service";
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: "app-gallery-list",
  templateUrl: "./gallery-list.component.html",
  styleUrls: ["./gallery-list.component.css"]
})
export class GalleryListComponent implements OnInit {
  @ViewChild('template') ModelTemplate: TemplateRef<any>;

  addScript: boolean = false;
  finalAmount: number = 0;
  public hideNumbers: Boolean = false;
  public payed: Boolean = false;
  public contestId: string;
  public gallerylist: any[];
  public currentuser: any; // Current user id by email varifiy
  public resMsg: any = ''; // After upload success
  public imgsrcArray: any;
  public modalRef: BsModalRef;
  public listingDetails: any;
  public accescode: any;
  public contestName: string;
  public emailval: string;
  public errMsg: any;
  public accesVeirfy: Boolean = false;
  public paymentForm: FormGroup;
  public transactionChecked: Boolean

  constructor(
    public router: Router,
    private modalService: BsModalService,
    public contestprovider: ContestService,
    public paypalProvider: PaypalProvider,
    public zone: NgZone,
    private fb: FormBuilder,
    public app: AppHelper,
    public translate: TranslateService,
    public auth: AuthService
  ) { }

  // Open payment email validation popup
  async openModal(template: TemplateRef<any>, data) {
    console.log(data)
    try {
      const user = await this.auth.me()
      if (user._id) {
        this.payed = false;
        this.contestId = data._id;
        this.paymentForm.reset();
        this.accesVeirfy = false;
        this.errMsg = 'null';
        this.listingDetails = data;
        this.paymentForm.controls['price'].setValue(data.entry_price + '€');
        this.finalAmount = data.entry_price;
        this.modalRef = this.modalService.show(template);
        localStorage.setItem('contestId', this.contestId);
        this.checkTransaction()
      } else {
        this.app.openLoginDialog()
      }
    } catch (e) {
      this.app.openLoginDialog()
    }
  }

  // Form submission
  submitform() {
    this.paymentForm.value.price = this.paymentForm.value.price.toString().substr(0, this.paymentForm.value.price.toString().indexOf('€'));
    this.paymentForm.value.name = "Contest Fees";
    this.paymentForm.value.sku = "111";
    this.paymentForm.value.currency = "EUR";
    this.paymentForm.value.quantity = 1;

    this.paypalProvider.PayWithPaypal(this.paymentForm.value)
      .then(res => {
        const priceEuro = this.paymentForm.value.price.toString()
        localStorage.setItem('price', priceEuro)
        localStorage.setItem('name', 'Contest Fees')
        localStorage.setItem('sku', '111')
        localStorage.setItem('currency', 'EUR')
        localStorage.setItem('quantity', '1')
        localStorage.setItem('email', this.auth.user.email)
        localStorage.setItem('contestId', this.contestId)
        window.location.href = res.approval_url;
      })
      .catch(err => console.log(this.contestId))
  }

  hideModal() {
    this.modalRef.hide()
  }

  // Create form
  createForm() {
    this.paymentForm = this.fb.group({
      paymentMethod: ['paypal'],
      price: [null, Validators.required],
      term_condition: [null, Validators.requiredTrue],
      name: [null],
      sku: [null],
      currency: [null],
      quantity: [null],
      contest: [null]
    });
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

  //Verify Access code with email
  // varifyCode() {
  //   this.accesVeirfy = false;
  //   this.accescode = this.paymentForm.get("numbers").value;
  //   this.emailval = this.paymentForm.get('email').value;
  //   this.contestprovider
  //     .varifyCode({ email: this.emailval, acess_code: this.accescode })
  //     .then(data => {
  //       this.accesVeirfy = data.message;
  //     });
  // }

  // Check transactions for payed contests
  public async checkTransaction() {
    this.transactionChecked = false
    const contestId = localStorage.getItem('contestId')
    try {
      const transaction = await this.paypalProvider.CheckTransaction(contestId)
      transaction ? this.payed = true : this.payed = false;
      this.transactionChecked = true
    } catch (e) {
      this.router.navigate(['/'])
    }
  }

  public navigateToContestPage($slug) {
    this.modalRef.hide();
    this.router.navigate(['contest', $slug]);
  }

  ngOnInit() {
    this.createForm();
    this.getContentData()
  }

}


