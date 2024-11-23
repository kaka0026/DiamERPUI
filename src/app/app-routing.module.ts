import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './Services/auth/auth.guard';

import { LoginComponent } from '../app/login/login.component';

import { DashboardComponent } from '../app/dashboard/dashboard.component';
import { SaveUpdateClientComponent } from '../app/Transaction/save-update-client/save-update-client.component';

const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'Client',component:SaveUpdateClientComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
