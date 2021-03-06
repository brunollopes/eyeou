import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContestComponent } from './components/contest/contest.component';
import { RulesComponent } from './pages/rules/rules.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AmbassadorComponent } from './pages/ambassador/ambassador.component';
import { HelpComponent } from './pages/help/help.component';
import { TermsComponent } from './pages/terms/terms.component';
import { ProcessingComponent } from './pages/processing/processing.component';
import { ResetComponent } from './components/reset/reset.component';

export const ROUTES : Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent, pathMatch: 'full'},
  { path: 'contest/:slug', component: ContestComponent },
  { path: 'rules', component: RulesComponent},
  { path: 'about', component: AboutComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'ambassador', component: AmbassadorComponent },
  { path: 'help', component: HelpComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'processing', component: ProcessingComponent },
  { path: 'reset', component: ResetComponent },
  { path: '**', redirectTo: '' }
];