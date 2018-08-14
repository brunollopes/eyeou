import { Component, OnInit, TemplateRef, NgZone } from "@angular/core";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder, FormControl, Validators, EmailValidator } from "@angular/forms";
import { ContestService } from "../../services/contest.service";
import { PaypalProvider } from "../../services/paypal.service";

@Component({
  selector: "app-gallery-list",
  templateUrl: "./gallery-list.component.html",
  styleUrls: ["./gallery-list.component.css"]
})
export class GalleryListComponent implements OnInit {

  addScript: boolean = false;
  finalAmount: number = 0;

  public payed: Boolean = false;
  public contestId: string;
  public gallerylist: any[];
  public currentuser: any; // Current user id by email varifiy
  public resMsg: any = ''; // After upload success
  public imgsrcArray: any;
  modalRef: BsModalRef;
  public listingDetails: any;
  public accescode: any;
  public contestName: string;
  public emailval: string;
  droppedimages = [];
  public errMsg: any;
  public accesVeirfy: any;
  public paymentForm: FormGroup;
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    public contestprovider: ContestService,
    public paypalProvider: PaypalProvider,
    public zone: NgZone,
    private fb: FormBuilder
  ) { }


  // open upload images popup
  openuploadModal(template: TemplateRef<any>, data) {
    this.payed = false;
    console.log(this.payed)
    this.paymentForm.reset();
    this.accesVeirfy = null;
    this.errMsg = null;
    // console.log("Data : ", data);
    this.listingDetails = data;
    this.contestName = data.contest_name;
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template);
  }

  // On image loading success
  onUploadFinished(event) {
    let file = {
      src: event.src,
      name: event.file.name,
      type: event.file.type
    }
    this.droppedimages.push(file);
  }


  // Upload iamges to server
  upload() {
    console.log('Working', this.droppedimages);
    console.log('Working', this.contestName);
    if (this.droppedimages && this.currentuser) {
      this.contestprovider
        .uploadimages({ files: this.droppedimages, contest_name: this.contestName, user_id: this.currentuser })
        .then((res: any) => {
          this.resMsg = res._id;
          if (this.resMsg != '') {
            setTimeout(() => {
              console.log("hello");
              this.modalRef.hide();
            }, 2000);
          }
        });
    }
  }



  // Open payment email validation popup
  openModal(template: TemplateRef<any>, data) {
    this.payed = false;
    this.contestId = data._id;
    this.paymentForm.reset();
    this.accesVeirfy = 'null';
    this.errMsg = 'null';
    // console.log("Data : ", data);
    this.listingDetails = data;
    this.paymentForm.controls['price'].setValue(data.prize_money);
    this.finalAmount = data.prize_money;
    this.modalRef = this.modalService.show(template);
  }


  // Browse images function
  BrowseMe() {
    let browseFile = document.querySelector('.img-ul-file-upload .img-ul-button') as HTMLElement;
    browseFile.click();
  }

  // Form submission
  submitform() {
    this.paymentForm.value.price = this.paymentForm.value.price.toString();
    this.paymentForm.value.name = "Contest Fees";
    this.paymentForm.value.sku = "111";
    this.paymentForm.value.currency = "USD";
    this.paymentForm.value.quantity = 1;
    this.paypalProvider.PayWithPaypal(this.paymentForm.value)
      .then(res => {
        localStorage.setItem('price', this.paymentForm.value.price.toString());
        localStorage.setItem('name', 'Contest Fees');
        localStorage.setItem('sku', '111');
        localStorage.setItem('currency', 'USD');
        localStorage.setItem('quantity', '1');
        localStorage.setItem('email', this.paymentForm.value.email);
        localStorage.setItem('user', this.currentuser);
        localStorage.setItem('contestId', this.contestId);
        this.payed = false;
        window.location.href = res.approval_url;
        // this.windowRef.nativeWindow.location.href = res.approval_url
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
    this.contestprovider.getContests().then((data: Array<any>) => {
      // console.log("Data ", data);
      this.gallerylist = data;
    });
  }

  // Access get code by email
  getaccesCode() {
    this.emailval = this.paymentForm.get("email").value;
    // console.log("Email sent", this.emailval);
    this.contestprovider.getAccesCode(this.emailval).then((res: any) => {
      this.currentuser = res._id;
      console.log("Email sent", res);
    });
  }

  //Verify Access code with email
  varifyCode() {
    this.accescode = this.paymentForm.get("numbers").value;
    this.contestprovider
      .varifyCode({ email: this.emailval, acess_code: this.accescode })
      .then(data => {
        // console.log('Data ', data);
        this.accesVeirfy = data;
        this.accesVeirfy = this.accesVeirfy.message;
        if (this.accesVeirfy) {

        }
      });
  }

  // Email validation
  public async emailErr() {
    this.errMsg = this.paymentForm.get("email").invalid;
    let email = this.paymentForm.get("email").value;
    let user = await this.contestprovider.getAccesCode(email);

    if (!this.errMsg) {
      this.paypalProvider
        .CheckTransaction({user: user._id, contest: this.contestId})
        .then(res => {
          let transaction = JSON.parse(res._body);
          console.log(transaction)
          transaction ? this.payed = true : this.payed = false;
        })
        .catch(err => {console.log(err)})
    }
  }

  ngOnInit() {
    // this.router.navigate(['/uploads']);  
    this.createForm();
    this.getContentData();
    let url = new URL(window.location.href),
      paymentId = url.searchParams.get('paymentId'),
      token = url.searchParams.get('token'),
      PayerID = url.searchParams.get('PayerID'),
      items = [{
        price: localStorage.getItem('price')
      }],
      user = localStorage.getItem('userId'),
      contest = localStorage.getItem('contestId')

    if (paymentId && token && PayerID) {

      this.paypalProvider.ExecutePayment({
        PayerID, paymentId, items, user, contest
      })
      .then(res => console.log(res))
      .catch(err => console.log(err))
    }
  }

}


