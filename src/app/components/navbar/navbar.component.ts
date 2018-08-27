import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component'
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

  constructor(
    public app: AppComponent,
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
    console.log(this.fixed, this.bgColor)
    if (!this.fixed) {
      document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
    } else {
      document.getElementById('lead-navbar').style.height = "53px"
    }
  }

  public switchLanguage(lang) {
    this.translate.changeLang(lang);
  }

  // Header Fixed
  @HostListener('window:scroll', [])
  onWindowScroll($event) {
    if (this.fixed && (this.router.url === '/' || location.href.includes('/?'))) {
      if (window.scrollY >= 80) {
        document.getElementById('lead-navbar').style.background = "rgba(0,0,0,0.9)";
      }
      else {
        document.getElementById('lead-navbar').style.background = "transparent";
        document.getElementById('lead-navbar').style.height = "53px"
      }
    }
  }

  openDialog() {
    this.app.openDialog()
  }

  async logout() {
    try {
      const logout = await this.auth.logout();
      const user = await this.auth.me();
      console.log('>> LOGOUT:', logout);
      console.log('>> USERL', user);
    } catch (e) {
      console.log(e)
    }
  }

}
