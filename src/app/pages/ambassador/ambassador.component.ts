import { Component, OnInit } from '@angular/core';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-ambassador',
  templateUrl: './ambassador.component.html',
  styleUrls: ['./ambassador.component.css']
})
export class AmbassadorComponent implements OnInit {

  constructor(public translate: TranslateService) { }

  ngOnInit() {
  }

}
