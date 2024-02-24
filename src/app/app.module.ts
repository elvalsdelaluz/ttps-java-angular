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
import { ListFriendsComponent } from './pages/list-friends/list-friends.component';
import { AddFriendsComponent } from './pages/add-friends/add-friends.component';
import { FormBillSummaryComponent } from './pages/form-bill-summary/form-bill-summary.component';
import { EditBillSummaryComponent } from './pages/edit-bill-summary/edit-bill-summary/edit-bill-summary.component';
import { GroupBalanceComponent } from './pages/group-balances/group-balance/group-balance.component';

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
    ListFriendsComponent,
    AddFriendsComponent,
    FormBillSummaryComponent,
    EditBillSummaryComponent,
    GroupBalanceComponent
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
