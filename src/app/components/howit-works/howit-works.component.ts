import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-howit-works',
  templateUrl: './howit-works.component.html',
  styleUrls: ['./howit-works.component.css']
})
export class HowitWorksComponent implements OnInit {
  public worklist: any[];
  constructor(public translate: TranslateService) {
  
  }

  ngOnInit() {

  }

}
