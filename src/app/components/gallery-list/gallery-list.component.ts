import { Component, OnInit, TemplateRef, NgZone, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { FormGroup, FormBuilder, FormControl, Validators, EmailValidator } from "@angular/forms";
import { ContestService } from "../../services/contest.service";
import { PaypalProvider } from "../../services/paypal.service";
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';

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
  
  constructor(
    public router: Router,
    private modalService: BsModalService,
    public contestprovider: ContestService,
    public paypalProvider: PaypalProvider,
    public zone: NgZone,
    private fb: FormBuilder,
    public helper: AppHelper,
    public translate: TranslateService
  ) { }

  // Open payment email validation popup
  openModal(template: TemplateRef<any>, data) {
    this.hideNumbers = false;
    this.paymentForm.addControl('numbers', new FormControl(null, Validators.required));
    this.payed = false;
    this.contestId = data._id;
    this.paymentForm.reset();
    this.accesVeirfy = false;
    this.errMsg = 'null';
    this.listingDetails = data;
    this.paymentForm.controls['price'].setValue(data.entry_price);
    this.finalAmount = data.entry_price;
    this.modalRef = this.modalService.show(template);
    localStorage.setItem('contestId', this.contestId);
  }

  // Form submission
  submitform() {
    this.paymentForm.value.price = this.paymentForm.value.price.toString();
    this.paymentForm.value.name = "Contest Fees";
    this.paymentForm.value.sku = "111";
    this.paymentForm.value.currency = "USD";
    this.paymentForm.value.quantity = 1;

    console.log('>> Form Submitted!')
    this.paypalProvider.PayWithPaypal(this.paymentForm.value)
      .then(res => {
        localStorage.setItem('price', this.paymentForm.value.price.toString())
        localStorage.setItem('name', 'Contest Fees')
        localStorage.setItem('sku', '111')
        localStorage.setItem('currency', 'USD')
        localStorage.setItem('quantity', '1')
        localStorage.setItem('email', this.paymentForm.value.email)
        console.log('>> Response:', res)
        window.location.href = res.approval_url;
      })
      .catch(err => console.log(err))
  }

  // Create form
  createForm() {
    this.paymentForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      numbers: [null, Validators.required],
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
        resolve(data)
      });
    })
  }

  //Verify Access code with email
  varifyCode() {
    this.accesVeirfy = false;
    this.accescode = this.paymentForm.get("numbers").value;
    this.emailval = this.paymentForm.get('email').value;
    this.contestprovider
      .varifyCode({ email: this.emailval, acess_code: this.accescode })
      .then(data => {
        this.accesVeirfy = data.message;
      });
  }

  // Email validation
  public async emailErr(first: Boolean = true) {
    this.errMsg = this.paymentForm.get("email").invalid;
    let email = this.paymentForm.get("email").value;

    if (first) {
      this.hideNumbers = false;
      this.paymentForm.addControl('numbers', new FormControl(null, Validators.required));
      let user = await this.contestprovider.getAccesCode(email);
      console.log(user)
      this.currentuser = user._id;
      localStorage.setItem('userId', user._id);
    } else {
      this.hideNumbers = true;
      this.paymentForm.removeControl('numbers');
    }

    if (!this.errMsg) {
      this.paypalProvider
        .CheckTransaction({ user: localStorage.getItem('userId'), contest: localStorage.getItem('contestId') })
        .then(transaction => {
          console.log(transaction)
          transaction ? this.payed = true : this.payed = false;
        })
        .catch(err => {
          this.router.navigate(['/'])
        })
    }
  }

  public navigateToContestPage($slug) {
    this.modalRef.hide();
    this.router.navigate(['contest', $slug]);
  }

  async ngOnInit() {
    this.createForm();
    let contests = await this.getContentData() as Array<any>;

    let url = new URL(window.location.href),
      paymentId = url.searchParams.get('paymentId'),
      token = url.searchParams.get('token'),
      PayerID = url.searchParams.get('PayerID'),
      items = [{
        price: localStorage.getItem('price')
      }];

    const user = localStorage.getItem('userId');
    const contest = localStorage.getItem('contestId')

    if (paymentId && token && PayerID) {
      this.paypalProvider.ExecutePayment({
        PayerID, paymentId, items, user, contest
      })
        .then(res => {
          this.router.navigate(['contest', res.contestUpdate.slug])
        })
        .catch(err => console.log(err))
    }
  }

}


