import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public signUpForm: FormGroup
  public signningUp: Boolean
  public err: any
  public done: any

  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<SignupComponent>,
    public auth: AuthService,
    public dialog: MatDialog
  ) { }

  signup() {
    if (this.signUpForm.valid) {
      this.err = null
      const { email, password } = this.signUpForm.value
      this.auth.signup({ email, password })
        .then(res => {
          if (res.error) {
            this.err = 'Invalid email or password'
          } else {
            this.done = "Account created successfully"
            setTimeout(() => {
              this.dialogRef.close(SignupComponent)
            }, 500)
          }
        })
        .catch(err => {
          this.err = 'Unknown error occured, please try again later.'
        })
    }
  }

  loginWithGoogle() {
    const url = location.origin;
    location.href = `${url}/auth/google`;
  }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      email: [null, Validators.compose([Validators.email, Validators.required])],
      password: [null, Validators.required]
    })
  }
}
