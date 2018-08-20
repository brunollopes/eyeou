import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../services/translate.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() fixed;
  @Input() bgColor;

  constructor(public translate: TranslateService, public router: Router) {

  }

  ngOnInit() {
    this.fixed = (this.fixed === 'true');
    this.bgColor = (this.bgColor === 'true');
    window.scrollTo(0, 80);
    window.scrollTo(0, 0);
    console.log(this.fixed, this.bgColor)
    if (!this.fixed) {
      document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
    } else {
      document.getElementById('lead-navbar').style.height = "90px"
    }
  }

  public switchLanguage(lang) {
    this.translate.changeLang(lang);
  }

  // Header Fixed
  @HostListener('window:scroll', [])
  onWindowScroll($event) {
    console.log(this.router.url)
    if (this.fixed && this.router.url === '/') {
      if (window.scrollY >= 80) {
        document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
      }
      else {
        document.getElementById('lead-navbar').style.background = "transparent";
        document.getElementById('lead-navbar').style.height = "100px"
      }
    }
  }

}
