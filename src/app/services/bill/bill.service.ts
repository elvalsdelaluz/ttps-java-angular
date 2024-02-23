import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BillRequest } from './billRequest';
import { Gasto } from '../../pages/bills/bill';
import { User } from '../../pages/group/group';
import { BillResponse } from './billResponse';
import { BalanceResponse } from './balanceResponse';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  
  //Esto no se si es correcto que este en esta clase o en la de Group
  private userListSource = new BehaviorSubject<User[]>([]);
  miembros$ = this.userListSource.asObservable();

  //28-1-2024
  miBehavionSubject = new BehaviorSubject<string> ("hola desde billService!");

  updateUserList(users: User[]) {
    this.userListSource.next(users);
  }
  //Mientras tanto la dejo aca.

  private readonly API = 'http://localhost:8080/cuentasclaras/gasto';

  constructor(private http: HttpClient) { }

  
  addGasto(bill:BillRequest, id_grupo?:string,):Observable<void>{
    const url = id_grupo ? `${this.API}/resumen/${id_grupo}` : this.API;
    return this.http.post<void>(url, bill)
  }

  editGasto(bill:BillRequest, id_gasto?:string,):Observable<void>{
    const url = id_gasto ? `${this.API}/editar/${id_gasto}` : this.API;
    return this.http.put<void>(url, bill)
  }

  getGastos(id?:string):Observable<BillResponse[]>{
    console.log("Retornando gastos ", id)
    const url = id ? `${this.API}/${id}` : this.API;
    return this.http.get<BillResponse[]>(url) //tengo que recuperar el id del grupo KJKSFJDJFLSKDF
  }

  getGasto(id?: string): Observable<BillResponse>{
    const url = id ? `${this.API}/editar/${id}` : this.API;
    return this.http.get<BillResponse>(url) 
  }

  getSaldos(id?:string):Observable<BalanceResponse[]>{
    console.log("Retornando gastos ", id)
    const url = id ? `${this.API}/saldos/${id}` : this.API;
    return this.http.get<BalanceResponse[]>(url) //tengo que recuperar el id del grupo KJKSFJDJFLSKDF
  }


  
}
