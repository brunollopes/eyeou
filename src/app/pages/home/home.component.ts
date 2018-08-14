import { ContestService } from '../../services/contest.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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


  constructor() {

  }

  ngOnInit() {
    console.log('Hello home component');
  }


}

