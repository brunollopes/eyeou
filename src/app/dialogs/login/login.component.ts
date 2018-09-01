import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material';
import { SignupComponent } from '../../dialogs/signup/signup.component';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '../../services/translate.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup
  public loggingIn: Boolean
  public err: any
  public success: any

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>,
    public auth: AuthService,
    public dialog: MatDialog,
    public translate: TranslateService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSignupDialog(): void {
    this.dialogRef.close()
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '450px'
    });
  }

  loginWithGoogle() {
    const url = location.origin;
    location.href = `${url}/auth/google`;
  }

  loginWithFacebook() {
    const url = location.origin;
    location.href = `${url}/auth/facebook`;
  }

  login() {
    this.success = false;
    this.err = false
    if (this.loginForm.valid) {
      this.err = null
      const { email, password } = this.loginForm.value
      this.auth.login({ email, password })
        .then(res => {
          if (res.error) {
            this.err = this.translate.lang.invalidEmail
          } else {
            this.dialogRef.close(LoginComponent)
          }
        })
        .catch(err => {
          this.err = 'Unknown error occured, please try again later.'
        })
    }
  }

  resetPassword() {
    this.success = false;
    this.err = false;
    const email = this.loginForm.controls['email']
    if (email.valid) {
      this.auth.forgetPassword({email: email.value})
        .then(res => {
          this.success = this.translate.lang.resetEmailSent
        })
    } else {
      this.err = this.translate.lang.enterValidEmail
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.email, Validators.required])],
      password: [null, Validators.required]
    })
  }

}
