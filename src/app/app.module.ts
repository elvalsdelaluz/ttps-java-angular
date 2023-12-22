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
import { FormGroupComponent } from './form-group/form-group.component';
import { BillsComponent } from './pages/bills/bills.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormBillComponent } from './pages/form-bill/form-bill/form-bill.component';

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
    FormBillComponent
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
