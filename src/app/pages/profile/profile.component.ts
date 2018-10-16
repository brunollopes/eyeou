import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '../../services/translate.service';
import { AppHelper } from '../../services/app.helper';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileImage') clicker: ElementRef;

  public infoForm: FormGroup
  public loading: Boolean
  public loadingImage: Boolean
  public user: any

  constructor(
    public translate: TranslateService,
    public helper: AppHelper,
    public auth: AuthService,
    public fb: FormBuilder
  ) { }

  public buildForm() {
    this.infoForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      birthDate: [null, Validators.required],
      locationAddress: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [null, Validators.required],
      gender: [null, Validators.required],
      aboutMe: [null, Validators.required]
    })
  }

  blurSave($e) {
    const data = {
      [$e.id]: $e.value
    }
    this.auth.updateMe(data)
      .then(user => {
        this.infoForm.patchValue(user)
        this.user = user
      })
      .catch(err => {
        console.log(err)
      })
  }

  dateChange($event) {
    this.blurSave({
      id: 'birthDate',
      value: $event.value
    })
  }

  selectFile() {
    let el: HTMLElement = this.clicker.nativeElement as HTMLElement;
    el.click();
  }

  fileChangeEvent(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {
      const formData = new FormData()
      formData.append('file', fileInput.target.files[0], 'file')
      this.loadingImage = true
      this.auth.updateImage(formData)
        .then(user => {
          this.user = user
          this.loadingImage = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  ngOnInit() {
    this.buildForm()
    this.loading = true
    this.auth.myProfile()
      .then(user => {
        this.infoForm.patchValue(user)
        this.loading = false
        this.user = user
      })
      .catch(err => {
        console.log(err)
      })
  }

}
