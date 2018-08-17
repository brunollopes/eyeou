import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ContestComponent } from './components/contest/contest.component';

export const ROUTES : Routes = [
  { path: '', component: HomeComponent},
  { path: 'home', component: HomeComponent, pathMatch: 'full'},
  { path: 'contest/:slug', component: ContestComponent }
];