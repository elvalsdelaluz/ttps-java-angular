import { NgModule } from '@angular/core';
import { BrowserModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './shared/nav/nav.component';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GroupComponent } from './pages/group/group.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { BillsComponent } from './pages/bills/bills.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormBillComponent } from './pages/form-bill/form-bill/form-bill.component';
import { ListFriendsComponent } from './pages/list-friends/list-friends.component';
import { AddFriendsComponent } from './pages/add-friends/add-friends.component';
import { Formulario2Component } from './formulario2/formulario2.component';
import { FormBillSummaryComponent } from './pages/form-bill-summary/form-bill-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    LoginComponent,
    NavComponent,
    GroupComponent,
    FormGroupComponent,
    BillsComponent,
    RegisterComponent,
    FormBillComponent,
    ListFriendsComponent,
    AddFriendsComponent,
    Formulario2Component,
    FormBillSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
