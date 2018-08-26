import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContestService } from '../../services/contest.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  public contactForm: FormGroup
  public msgSent: Boolean
  constructor(
    public contestProvider: ContestService,
    public translate: TranslateService,
    public fb: FormBuilder
  ) { }

  public sendMessage() {
    this.msgSent = false;
    this.contestProvider.sendEmail(this.contactForm.value)
      .then(res => {
        this.msgSent = true;
        this.contactForm.reset();
      })
      .catch(err => console.log(err))
  }

  ngOnInit() {
    this.contactForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.compose([Validators.email, Validators.required])],
      subject: [null, Validators.required],
      message: [null, Validators.required]
    });
  }
}
