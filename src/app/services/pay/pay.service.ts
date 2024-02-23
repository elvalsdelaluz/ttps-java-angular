import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PayRequest } from './payRequest';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  private readonly API = 'http://localhost:8080/cuentasclaras/pago';

  constructor(private http: HttpClient) { }

  
  addPay(pay:PayRequest, id_grupo?:string,):Observable<void>{
    const url = id_grupo ? `${this.API}/${id_grupo}` : this.API;
    return this.http.post<void>(url, pay)
  }

}
