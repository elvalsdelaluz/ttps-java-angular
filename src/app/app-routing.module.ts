import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormGroupComponent } from './pages/form-group/form-group.component';
import { GroupComponent } from './pages/group/group.component';
import { BillsComponent } from './pages/bills/bills.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormBillComponent } from './pages/form-bill/form-bill/form-bill.component';
import { checkLoginGuard } from './shared/guards/check-login.guard';
import { ListFriendsComponent } from './pages/list-friends/list-friends.component';
import { AddFriendsComponent } from './pages/add-friends/add-friends.component';
import { Formulario2Component } from './formulario2/formulario2.component';

const routes: Routes = [
  {path:'',redirectTo:'/iniciar-sesion', pathMatch:'full'},
  {path:'iniciar-sesion',component:LoginComponent},
  {path: 'registro', component: RegisterComponent},
  {path:'inicio',component:DashboardComponent,
   children:[
    {path: 'formulario-grupo', component:FormGroupComponent},
    {path:'grupos', component: GroupComponent},  
    {path: 'formulario-gasto/:idGrupo', component: FormBillComponent},
    {path: 'gastos/:idGrupo', component:BillsComponent},
    {path:'amigos', component:ListFriendsComponent},
    {path:'agregar-participante/:idGrupo', component:AddFriendsComponent}
   ],
   //canActivate:[checkLoginGuard]
  }, 
  {path:'prueba2',component:Formulario2Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
