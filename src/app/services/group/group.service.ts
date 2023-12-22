import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Grupo } from '../../pages/group/group';
import { GroupRequest } from './groupRequest';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly API = 'http://localhost:8080/cuentasclaras/grupo/';

  constructor(private http: HttpClient) {  }

  addGrupo(group:GroupRequest):Observable<Grupo>{
    const body = {
      nombre: group.nombre,
      categoria: group.categoria
    };
    return this.http.post<Grupo>(this.API, body)
  }

  getGrupos():Observable<Grupo[]>{
       //tengo que sacar el id del usuario del localstorage
    const body = {
      nombre: "",
      categoria: ""
    };
    return this.http.post<Grupo[]>(this.API, body)
  }
  
  updateGrupo(grupo: Grupo):Observable<void>{
    const body = {
      nombre: "",
    }; 
    return this.http.put<void>(`${this.API}/${grupo.id}`, body)
  }

}
