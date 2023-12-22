import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import  {  Observable, throwError, catchError, BehaviorSubject , tap} from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> =new BehaviorSubject<User>({id_usuario:0, email:''});
  
  private readonly API = 'http://localhost:8080/cuentasclaras/usuario/login';

  constructor(private http: HttpClient) { }


  login(credentials:LoginRequest): Observable<User> {
    const body = {
      email: credentials.email,
      contraseña: credentials.password
    };
    return this.http.post<User>(this.API, body).pipe(
      tap( (userData: User) => {
        // Almaceno la información del usuario en el Local Storage
        localStorage.setItem('userData', JSON.stringify(userData));
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error:HttpErrorResponse){
    if(error.status===404){
      console.error('Se ha producio un error ', error.error);
      return throwError(()=> new Error('El email o la contraseña es invalido.'));
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

  get userData():Observable<User>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

}