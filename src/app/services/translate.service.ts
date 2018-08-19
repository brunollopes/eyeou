import { Injectable } from '@angular/core';
import { en, pt } from '../helpers/translate.helper';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  public lang = en;
  public showLang = 'en';
  constructor() { }
  
  public changeLang(lang) {
    if (lang == 'en') {
      this.lang = en;
      this.showLang = 'en';
    } else {
      this.lang = pt;
      this.showLang = 'pt';
    }
  }
}
