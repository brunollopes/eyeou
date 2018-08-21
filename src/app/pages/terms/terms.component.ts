import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
