import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {
  public showLanguage = 'en';
  constructor(public translate: TranslateService) {
    this.showLanguage = localStorage.getItem('language') === null ? 'en' : localStorage.getItem('language');
   }


// Language change function
 public switchLanguage(language) {
    this.translate.use(language);
    this.showLanguage = language;
    localStorage.setItem("language", this.showLanguage);
    let lngss = localStorage.getItem("language");
  }

  // Header Fixed
  @HostListener('window:scroll', [])
  onWindowScroll($event) {
    if (window.scrollY >= 80) {
      document.getElementById('lead-navbar').style.background="rgba(0,0,0,0.9)";
      document.getElementById('lead-navbar').style.top="0px";
      document.getElementById('lead-navbar').style.padding="5px 20px";
      document.getElementById('logo-winpic').style.maxHeight ="25px";
    }
    else{
      document.getElementById('lead-navbar').style.background="transparent";
      document.getElementById('lead-navbar').style.top="0px";
      document.getElementById('lead-navbar').style.padding="25px";
      document.getElementById('logo-winpic').style.maxHeight ="40px";

    }
  }

  

  ngOnInit() {
  }

}
