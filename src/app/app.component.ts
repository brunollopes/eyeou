import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './dialogs/login/login.component';
import { TranslateService } from './services/translate.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public dialog: MatDialog,
    public translate: TranslateService
  ) { }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '450px'
    });
  }

  async ngOnInit() {
    try {
      const location = await this.auth.location()
      console.log(location)
      if (location === 'PT') {
        this.translate.changeLang('pt');
      }
    } catch (e) {
      console.log(e)
    }
  }
}