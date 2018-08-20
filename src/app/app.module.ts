import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropModule } from 'ngx-file-drop';

import { ROUTES } from './app.router';
import { MaterialModule } from './modules/material.module';

import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderTilesComponent } from './components/slider-tiles/slider-tiles.component';
import { HowitWorksComponent } from './components/howit-works/howit-works.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { ContestService } from './services/contest.service';
import { PaypalProvider } from './services/paypal.service';
import { AppHelper } from './services/app.helper';
import { ContestComponent } from './components/contest/contest.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConverSizePipe } from './pipes/conver-size.pipe';
import { RulesComponent } from './pages/rules/rules.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AmbassadorComponent } from './pages/ambassador/ambassador.component';
import { HelpComponent } from './pages/help/help.component';
import { TermsComponent } from './pages/terms/terms.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SliderTilesComponent,
    HowitWorksComponent,
    GalleryListComponent,
    ContestComponent,
    NavbarComponent,
    ConverSizePipe,
    RulesComponent,
    AboutComponent,
    ContactComponent,
    AmbassadorComponent,
    HelpComponent,
    TermsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FileDropModule,
    RouterModule.forRoot(ROUTES),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ContestService, PaypalProvider, AppHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
