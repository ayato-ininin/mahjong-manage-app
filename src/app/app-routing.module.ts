import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SeisanComponent } from './components/seisan/seisan.component';

const routes: Routes = [
  { path: '', redirectTo: '/seisan', pathMatch: 'full' },
  { path: 'seisan', component: SeisanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
