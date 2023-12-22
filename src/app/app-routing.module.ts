import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormGroupComponent } from './form-group/form-group.component';
import { GroupComponent } from './pages/group/group.component';
import { BillsComponent } from './pages/bills/bills.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormBillComponent } from './pages/form-bill/form-bill/form-bill.component';

const routes: Routes = [
  {path:'',redirectTo:'/iniciar-sesion', pathMatch:'full'},
  {path:'iniciar-sesion',component:LoginComponent},
  {path: 'registro', component: RegisterComponent},
  {path:'inicio',component:DashboardComponent,
   children:[
    {path: '', component: GroupComponent},
    {path: 'formulario-grupo', component:FormGroupComponent},
    {path: 'gastos/:idGrupo', component:BillsComponent},
   ]
  },
  {path: 'formulario-gasto/:idGrupo', component: FormBillComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
