import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title = 'app';
  public showLanguage = 'en';
  constructor(public translate: TranslateService) {
    // localStorage.clear();
    // this.translate.addLangs(['pt', 'en']);
    // translate.setDefaultLang('en');
    this.showLanguage = localStorage.getItem('language') === null ? 'en' : localStorage.getItem('language');
    translate.setDefaultLang(this.showLanguage);
  }

  switchLanguage(language: string) {
    console.log('switchlanguage');
    this.translate.use(language);
  }
}
