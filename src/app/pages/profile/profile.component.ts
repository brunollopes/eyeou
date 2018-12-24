import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '../../services/translate.service';
import { AppHelper } from '../../services/app.helper';
import { AuthService } from '../../services/auth.service';
import { ContestService } from '../../services/contest.service';

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
  public images: any

  public view: string = 'profile'
  public changeView(view) {
    this.view = view
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event
  }
  imageCropped(event) {
    const url = event.base64
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        this.croppedImage = new File([blob], "file")
      })
  }
  imageLoaded() {
    console.log('>> IMAGE LOADDED')
    // show cropper
  }
  loadImageFailed() {
    console.log('>> IMAGE LOADING FAILED')
    // show message
  }

  constructor(
    public translate: TranslateService,
    public helper: AppHelper,
    public auth: AuthService,
    public fb: FormBuilder,
    public constestProvider: ContestService
  ) {

  }

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

  blurSavePhoto($e, image, imgIndex) {
    const data = {
      [$e.id]: $e.value
    }
    this.constestProvider.updateImage(image._id, data)
      .then(image => {
        this.images[imgIndex].editForm.patchValue(image)
      })
      .catch(err => {
        console.log(err)
      })
  }

  dateChangePhoto($event, image, imgIndex) {
    this.blurSavePhoto({
      id: 'dateTaken',
      value: $event.value
    }, image, imgIndex)
  }

  selectFile() {
    let el: HTMLElement = this.clicker.nativeElement as HTMLElement;
    el.click();
  }

  uploadImage() {
    this.imageChangedEvent = null
    if (this.croppedImage) {
      const formData = new FormData()
      formData.append('file', this.croppedImage, 'file')
      this.loadingImage = true
      this.auth.updateImage(formData)
        .then(user => {
          console.log(user)
          this.user = user
          this.loadingImage = false
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  async ngOnInit() {
    this.buildForm()
    this.loading = true


    try {
      const user = await this.auth.myProfile()
      this.infoForm.patchValue(user)
      this.loading = false
      this.user = user

      const images = await this.constestProvider.myImages()
      images.forEach(image => {
        image.editForm = this.fb.group({
          cameraModel: [null, Validators.required],
          cameraLens: [null, Validators.required],
          aperture: [null, Validators.required],
          iso: [null, Validators.required],
          focalLens: [null, Validators.required],
          dateTaken: [null, Validators.required],
          location: [null, Validators.required],
          description: [null, Validators.required]
        })
        image.editForm.patchValue(image)
      })
      this.images = images

      console.log(this.images)
    } catch (e) {
      console.log(e)
    }

  }

}
