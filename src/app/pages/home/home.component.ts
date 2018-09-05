import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { ContestService } from '../../services/contest.service';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  willNotify: Boolean
  weeklyContest = {
    prize_money: Number,
    start_date: Date,
    contest_name: String,
    openphase_duration: Number,
    contest_title: String,
    submit_time: Date,
    review_time: Date,
    bgprofile_image: String,
    entry_price: Number,
    results: String,
    review_startdate: Date,
    reviewphase_duration: Number,
    close_date: Date,
    type: String,
  };


  notifyGroup: FormGroup;
  err: boolean
  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public contestProvider: ContestService
  ) {

  }

  notifyUser() {
    const {name, email} = this.notifyGroup.value;
    if (this.notifyGroup.valid) {
      this.err = false;
      this.willNotify = false;
      this.contestProvider.notifyUser(name, email).then(res => { this.willNotify = true })
    } else {
      this.willNotify = false;
      this.err = true
    }
  }

  ngOnInit() {
    this.notifyGroup = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      name: [null, Validators.required]
    })
  }


}

