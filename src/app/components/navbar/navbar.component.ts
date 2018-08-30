import { Component, OnInit, HostListener, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { AppHelper } from '../../services/app.helper'
import { TranslateService } from '../../services/translate.service';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() fixed;
  @Input() bgColor;
  @ViewChild('button') button

  constructor(
    public app: AppHelper,
    public translate: TranslateService,
    public router: Router,
    public auth: AuthService
  ) {

  }

  ngOnInit() {
    this.fixed = (this.fixed === 'true');
    this.bgColor = (this.bgColor === 'true');
    window.scrollTo(0, 80);
    window.scrollTo(0, 0);

    if (!this.fixed) {
      document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
    } else {
      document.getElementById('lead-navbar').style.height = "53px"
    }
  }

  public switchLanguage(lang) {
    this.translate.changeLang(lang);
  }

  public closeMenu() {
    document.getElementById('button').click()
  }

  // Header Fixed
  @HostListener('window:scroll', [])
  onWindowScroll($event) {
    if (this.fixed && (this.router.url === '/' || location.href.includes('/?') || location.href.includes('#'))) {
      if (window.scrollY >= 80 || window.screenY) {
        document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
      }
      else {
        document.getElementById('lead-navbar').style.background = "transparent";
        document.getElementById('lead-navbar').style.height = "53px"
      }
    }
  }

  openDialog() {
    this.closeMenu()
    this.app.openLoginDialog()
  }

  async logout() {
    this.closeMenu()
    try {
      const logout = await this.auth.logout();
      const user = await this.auth.me();
      this.router.navigate(['/']);
    } catch (e) {
      console.log(e);
    }
  }

}
