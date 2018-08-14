import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ROUTES } from './app.router'

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SliderTilesComponent } from './components/slider-tiles/slider-tiles.component';
import { HowitWorksComponent } from './components/howit-works/howit-works.component';
import { GalleryListComponent } from './components/gallery-list/gallery-list.component';
import { ContestService } from './services/contest.service';
import { PaypalProvider } from './services/paypal.service';
import { ImageUploadModule } from "angular2-image-upload";


export function HttpLoaderFactory(http: HttpClient) {
  // return new TranslateHttpLoader(http);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');

}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    SliderTilesComponent,
    HowitWorksComponent,
    GalleryListComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ImageUploadModule.forRoot(),

  ],
  providers: [ContestService, PaypalProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
