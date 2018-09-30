import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadEvent, UploadFile, FileSystemEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ContestService } from '../../services/contest.service';
import { AppHelper } from '../../services/app.helper';
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { PaypalProvider } from "../../services/paypal.service";
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { StripeModal } from '../gallery-list/gallery-list.component'


@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  public uploading: Boolean = false;
  public files = [];
  public previewFiles: Array<any> = [];
  public contestId: string;
  public contest: any;
  public userId: string;
  public maxLimitReached: Boolean = false;
  public uploadLimit;

  constructor(
    public router: Router,
    public routeParams: ActivatedRoute,
    public contestProvider: ContestService,
    public helper: AppHelper,
    public translate: TranslateService,
    public auth: AuthService,
    public dialog: MatDialog,
    public bsModalRef: BsModalRef,
    public modalService: BsModalService
  ) { }

  public openDialog() {
    const initialState = {
      data: {
        _id: this.contestId
      }
    }
    this.bsModalRef = this.modalService.show(PostPaymentDialog, { initialState });
  }

  public browseFiles() {
    document.getElementById('selectedFiles').click()
  }

  public dropped(event, browse = false) {
    if (browse) {
      event.files = event.target.files
      if ((this.files.length + 1 > this.uploadLimit) ||
        ((event.files.length + this.contest.users[0].images.length) > this.uploadLimit) ||
        ((this.files.length + 1 + this.contest.users[0].images.length) > this.uploadLimit)) {
        this.maxLimitReached = true;
        setTimeout(() => {
          this.maxLimitReached = false
        }, 1500)
      } else {
        for (const file in event.target.files) {
          // FILE SIZE LIMIT HERE
          if (event.target.files[file].size < 1.5e+7) {
            this.previewFiles.push({
              name: event.target.files[file].name,
              size: event.target.files[file].size,
              lastModifiedDate: event.target.files[file].lastModified,
              type: event.target.files[file].type,
              status: 'Added'
            });
            this.files.push(event.target.files[file]);
            this.previewFiles = this.helper.removeDuplicates(this.previewFiles, 'name');
            this.files = this.helper.removeDuplicates(this.files, 'name');
          } else {
            console.log('>> FILE NOT ADDED')
          }
        }
      }
    } else {
      if ((this.files.length + 1 > this.uploadLimit) ||
        ((event.files.length + this.contest.users[0].images.length) > this.uploadLimit) ||
        ((this.files.length + 1 + this.contest.users[0].images.length) > this.uploadLimit)) {
        this.maxLimitReached = true;
        setTimeout(() => {
          this.maxLimitReached = false
        }, 1500)
      } else {
        this.maxLimitReached = false;

        for (const droppedFile of event.files) {
          // FILE SIZE LIMIT HERE
          if (droppedFile.fileEntry.isFile) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
              if (file.size < 1.5e+7) {
                this.previewFiles.push({
                  name: file.name,
                  size: file.size,
                  lastModifiedDate: file.lastModified,
                  type: file.type,
                  status: 'Added'
                });
                event.files.forEach($file => { this.files.push($file); });
                this.files = this.helper.removeDuplicates(this.files, 'relativePath');
                this.previewFiles = this.helper.removeDuplicates(this.previewFiles, 'name');
              } else {
                console.log('>> FILE NOT ADDED')
              }
            });
          } else {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
          }
        }
      }
    }
  }

  public uploadImages() {
    if (this.files.length) {
      let files = []
      for (const droppedFile of this.files) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        if (droppedFile instanceof File) {
          ((file: File) => {
            files.push(file)
          })(droppedFile);
        } else if (droppedFile instanceof UploadFile) {
          fileEntry.file((file: File) => {
            files.push(file)
          });
        }
      }
      setTimeout(async () => {
        try {
          const formData = new FormData()
          formData.append('contest_name', this.contestId);
          formData.append('user_id', this.userId);
          files.forEach(file => { formData.append('images', file, file.name) })
          this.uploading = true;
          this.previewFiles.forEach(($file) => {
            files.forEach(file => {
              if ($file.name == file.name) {
                $file.status = 'Uploading'
              }
            })
          });
          const uploadProcess = await this.contestProvider.uploadimages(formData);
          if (uploadProcess.error) {
            this.previewFiles.forEach(($file) => {
              files.forEach(file => {
                if ($file.name == file.name) {
                  $file.status = 'Failed'
                }
              })
            });
          } else {
            this.previewFiles.forEach(($file) => {
              files.forEach(file => {
                if ($file.name == file.name) {
                  $file.status = 'Uploaded'
                }
              })
            });
            this.files.forEach(($file, i) => {
              files.forEach(file => {
                if ($file.relativePath == file.name) {
                  this.files.splice(i, 1);
                }
              })
            });
            setTimeout(async () => {
              const contest = await this.contestProvider.getContestBySlug(localStorage.getItem('contestSlug'));
              this.contest = contest.contest;
              this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time)
            }, 3000)
          }
        } catch (e) {
          this.previewFiles.forEach(($file) => {
            files.forEach(file => {
              if ($file.name == file.name) {
                $file.status = 'Failed'
              }
            })
          });
          this.files.forEach(($file, i) => {
            files.forEach(file => {
              if ($file.relativePath == file.name) {
                this.files.splice(i, 1);
              }
            })
          });
        }
      }, 1200)
    }
  }

  public removeDropped(index) {
    this.files.splice(index, 1);
    this.previewFiles.splice(index, 1);
    if (this.files.length + 1 <= this.uploadLimit && this.previewFiles.length <= this.uploadLimit) {
      this.maxLimitReached = false;
    }
  }

  async ngOnInit() {
    try {
      const user = await this.auth.me()
      this.userId = user._id
      if (!this.userId) {
        this.router.navigate(['/'])
      } else {
        this.routeParams.params.subscribe(async data => {
          if (!data.slug) this.router.navigate(['/'])
          localStorage.setItem('contestSlug', data.slug)
          const contest = await this.contestProvider.getContestIdBySlug(data.slug);
          this.contestId = contest._id;

          this.contestProvider.isInContest({ slug: data.slug })
            .then(async res => {
              if (!res.userIncluded && res.contestType == 'free') {
                this.contestProvider.joinFreeContest(contest._id)
                  .then($contest => {
                    this.contest = $contest.contest;
                    this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time);

                    if (this.contest.prize_money == 0)
                      this.uploadLimit = 1

                    localStorage.setItem('contestSlug', data.slug);
                  })
                  .catch(err => { console.log(">> ERROR JOIN FREE:", err) })

              } else if (!res.userIncluded && res.contestType !== 'free') {
                return this.router.navigate(['/'])

              } else if (res.userIncluded) {
                this.contestProvider.getContestBySlug(data.slug)
                  .then($contest => {
                    this.contest = $contest.contest;
                    this.contest['timeRemains'] = this.helper.dateDiff(this.contest.review_time);
                    if (this.contest.entry_price == 0) {
                      this.uploadLimit = 1
                    } else {
                      const reducer = (accumulator, currentValue) => accumulator + currentValue;
                      this.uploadLimit = $contest.transaction.map(trans => trans.maxPhotosLimit).reduce(reducer);
                    }
                    localStorage.setItem('contestSlug', data.slug);
                  })
                  .catch(err => { console.log(">> ERROR GET CONTEST USER INCLUDED:", err) })
              }
            })
            .catch(err => {
              this.router.navigate(['/']);
            });
        });
      }
    } catch (e) {
      console.log(e)
    }
  }

}

@Component({
  templateUrl: './paymentDialog.html',
  styles: [

  ]
})
export class PostPaymentDialog implements OnInit {

  public payed: Boolean = false;
  public contestId: string;
  public gallerylist: any[];
  public currentuser: any;
  public paymentForm: FormGroup;
  public transactionChecked: Boolean;
  public clicked: Boolean = false;
  public paymentMethod;
  public voucherError;
  public loadingVoucher: Boolean = false;
  public data: any;

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

  paymentMethodChange(value) {
    this.paymentMethod = value
    console.log(value)
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

  createPaymentForm() {
    this.paymentForm = this.fb.group({
      term_condition: [null, Validators.requiredTrue],
      price: [null],
      contestId: [null],
      photos: [null, Validators.required],
      paymentMethod: [null, Validators.required]
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

  ngOnInit() {
    this.createPaymentForm();
    this.contestId = this.data._id;
    this.paymentForm.controls['contestId'].setValue(this.contestId);
  }

}