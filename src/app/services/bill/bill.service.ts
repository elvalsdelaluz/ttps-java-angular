import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BillRequest } from './billRequest';
import { Gasto } from '../../pages/bills/bill';
import { User } from '../../pages/group/group';

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
    const url = id_grupo ? `${this.API}/${id_grupo}` : this.API;
    return this.http.post<void>(url, bill)
  }

  getGastos(id?:string):Observable<Gasto[]>{
    console.log("Retornando gastos ", id)
    const url = id ? `${this.API}/${id}` : this.API;
    return this.http.get<Gasto[]>(url) //tengo que recuperar el id del grupo KJKSFJDJFLSKDF
  }

   setData(data: string){
    this.miBehavionSubject.next(data);
   }

   getData(){
    return this.miBehavionSubject.asObservable();
   }
}
