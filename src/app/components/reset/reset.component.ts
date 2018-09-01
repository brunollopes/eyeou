import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public resetForm: FormGroup
  public err: any = {};
  public success: Boolean = false;
  public resetCode: string;
  public id: string;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public auth: AuthService,
    public translate: TranslateService
  ) { }

  submitForm() {
    this.success = false;
    this.err.show = false;

    const password = this.resetForm.controls['password'].value,
      confirmPassword = this.resetForm.controls['confirmPassword'].value;

    if (password && confirmPassword && (password === confirmPassword)) {
      this.auth.resetPassword({ password, id: this.id, resetCode: this.resetCode })
        .then(res => {
          if (res === true) {
            this.success = true;
            setTimeout(() => {
              this.router.navigate(['/'])
            }, 1000)
          } else {
            this.err = {
              show: true,
              message: this.translate.lang.resetCodeError
            }
          }
        })
        .catch(err => {
          this.err = {
            show: true,
            message: this.translate.lang.resetCodeError
          }
        })
    } else {
      this.err = {
        show: true,
        message: this.translate.lang.passwordMatchError
      }
    }
  }

  ngOnInit() {
    let url = new URL(window.location.href),
      resetCode = url.searchParams.get('code'),
      id = url.searchParams.get('id')

    if (resetCode && id) {
      this.resetCode = resetCode;
      this.id = id;
      this.resetForm = this.fb.group({
        password: [null, Validators.required],
        confirmPassword: [null, Validators.required]
      });
    } else {
      this.router.navigate(['/'])
    }
  }
}

