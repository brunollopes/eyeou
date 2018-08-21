import { Component, OnInit } from '@angular/core';
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


  constructor(
    public translate: TranslateService,
    public contestProvider: ContestService
  ) {

  }

  notifyUser(name, email) {
    console.log(name, email)
    this.contestProvider.notifyUser(name, email).then(res => { this.willNotify = true })
  }

  ngOnInit() {
    console.log('Hello home component');
  }


}

