import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Grupo, User } from '../../pages/group/group';
import { GroupRequest } from './groupRequest';
import { LoginService } from '../auth/login.service';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly APIGrupos = 'http://localhost:8080/cuentasclaras/grupo/obtenerGrupos';
  private readonly API = 'http://localhost:8080/cuentasclaras/grupo';
  //Aca voy a cargar los grupos del usuario
  grupos: Grupo[] = []

  constructor(private http: HttpClient, private loginService: LoginService) {  }

  addGrupo(group:GroupRequest):Observable<Grupo>{
    const userData = this.loginService.userValue;
    group.idUser = userData.id_usuario.toString();
    return this.http.post<Grupo>(this.API, group);
  }

  getGrupos():Observable<Grupo[]>{
    console.log("Recuperando grupos del usuario");
    //tengo que sacar el id del usuario del localstorage
    //const userData = localStorage.getItem('userData'); //Esto me dejo de funcionar de la nda
    //console.log("LocalStorage: ", userData)
    const userDataAuth = this.loginService.userValue;
    console.log("Recuperando grupos del usuario ", userDataAuth);
    if (userDataAuth != null){
        return this.http.post<Grupo[]>(this.APIGrupos, userDataAuth);
    }
    else{
      return of([]);
    }
  }

  getNotUsersGroup(id_grupo:string){
  //Este metodo retorna los usuarios que no estan en el grupo
  //El id_grupo lo voy a usar para filtrar de la lista de participantes los que ya pertenecen al grupo
  return this.http.get<User[]>(`${this.API}/participantes/${id_grupo}`);
  }

  addFriendToGroup(id: string, user: User): Observable<Grupo>{
    //Este metodo agregar un nuevo participante a un grupo
    const body = {
      "id_usuario": user.id,
      "email": user.email
    }
    console.log("Id del usuario que quiero agregar al grupo: ", user)
    const url = `${this.API}/${id}`;
    console.log("URL de la solicitud PUT: ", url);
    return this.http.put<Grupo>(url, body);
  }
  
}
