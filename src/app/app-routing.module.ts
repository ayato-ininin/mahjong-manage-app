import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchRegisterComponent } from './components/match-register/match-register.component';
import { SeisanComponent } from './components/seisan/seisan.component';

const routes: Routes = [
  { path: '', redirectTo: '/match-register', pathMatch: 'full' },
  { path: 'match-register', component: MatchRegisterComponent },
  { path: 'seisan', component: SeisanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
