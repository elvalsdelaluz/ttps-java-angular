import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from './loginRequest';
import  {  Observable, throwError, catchError, BehaviorSubject , tap, map} from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  //currentUserData: BehaviorSubject<User> =new BehaviorSubject<User>({id_usuario:0, email:''}); //este mepa que lo borro
  private user = new BehaviorSubject<User>({id_usuario:0, email:''});

  private readonly API = 'http://localhost:8080/cuentasclaras/usuario/login';

  constructor(private http: HttpClient , private router: Router) { }
  
  get user$(): Observable<User> {
    return this.user.asObservable();
  }

  get userValue(): User {
    return this.user.getValue();
  }

  login(credentials:LoginRequest): Observable<User | void> {
    const body = {
      email: credentials.email,
      contraseña: credentials.password
    };
    return this.http.post<User>(this.API, body).pipe( //en vez de body puedo enviar credential directamente
      tap( (userData: User) => {
        // Almaceno la información del usuario en el Local Storage
        this.saveLocalStorage(userData);   
        //this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
        this.user.next(userData);
      }),
      catchError((err) => this.handlerError(err))
    );
  }

  logout(): void {
    localStorage.removeItem('userData');
    this.currentUserLoginOn.next(false);
    this.router.navigate(['/iniciar-sesion']);
  }

  private saveLocalStorage(user: User): void {
    localStorage.setItem('userData', JSON.stringify(user));

  }

  private handlerError(error:HttpErrorResponse){
    if(error.status===404){
      console.error('Se ha producio un error ', error.error);
      return throwError(()=> new Error('El email o la contraseña es invalido.'));
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

 // get userData():Observable<User>{
  //  return this.currentUserData.asObservable();
  //}

  get userLoginOn(): Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  isAuth(){
    //Chequeo el localStorage
    return this.currentUserLoginOn.value;
  }

}