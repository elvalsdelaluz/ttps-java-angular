import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupComponent } from './pages/group/group.component';
import { BillsComponent } from './pages/bills/bills.component';
import { RegisterComponent } from './auth/register/register.component';
import { checkLoginGuard } from './shared/guards/check-login.guard';
import { ListFriendsComponent } from './pages/list-friends/list-friends.component';
import { AddFriendsComponent } from './pages/add-friends/add-friends.component';
import { FormBillSummaryComponent } from './pages/form-bill-summary/form-bill-summary.component';
import { EditBillSummaryComponent } from './pages/edit-bill-summary/edit-bill-summary/edit-bill-summary.component';

const routes: Routes = [
  {path:'',redirectTo:'/iniciar-sesion', pathMatch:'full'},
  {path:'iniciar-sesion',component:LoginComponent},
  {path: 'registro', component: RegisterComponent},
  {path:'inicio',component:DashboardComponent,
   children:[
    {path: 'formulario-grupo', component:FormGroupComponent},
    {path:'grupos', component: GroupComponent},  
    {path:'editar-gasto/:idGrupo/:idGasto', component: EditBillSummaryComponent},
    {path:'resumen-gasto/:idGrupo', component: FormBillSummaryComponent},
    {path: 'gastos/:idGrupo', component:BillsComponent},
    {path:'amigos', component:ListFriendsComponent},
    {path:'agregar-participante/:idGrupo', component:AddFriendsComponent}
   ],
   //canActivate:[checkLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
