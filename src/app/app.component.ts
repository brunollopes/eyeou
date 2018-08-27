import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './dialogs/login/login.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public dialog: MatDialog
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '450px',
      data: { test: 'test' }
    });
  }

  async ngOnInit() {
    try {
      const user = await this.auth.me()
    } catch (e) {
      console.log(e)
    }
  }
}