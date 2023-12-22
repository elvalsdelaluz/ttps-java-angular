import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BillRequest } from './billRequest';
import { Gasto } from '../../pages/bills/bill';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  private readonly API = 'http://localhost:8080/cuentasclaras/gasto/';

  constructor(private http: HttpClient) { }

  
  addGasto(bill:BillRequest):Observable<void>{
    const body = {
      monto: bill.monto,
      id_usuario: bill.miembro
    };
    return this.http.post<void>(this.API, body)
  }

  getGastos():Observable<Gasto[]>{
  return this.http.get<Gasto[]>(this.API) //tengo que recuperar el id del grupo KJKSFJDJFLSKDF
}
}
