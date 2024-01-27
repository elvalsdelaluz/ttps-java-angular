import { Injectable } from '@angular/core';
import  {  Observable, throwError, catchError, BehaviorSubject , tap} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RegisterRequest } from './registerRequest';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private readonly API = 'http://localhost:8080/cuentasclaras/usuario';

  constructor(private http: HttpClient, private router: Router) { }
  
  register(user: RegisterRequest): Observable<void> {
    const body = {
      email: user.email,
      contraseña: user.password, // Aquí debería ser 'password', no 'contraseña'
      apellido: user.apellido,
      nombre: user.nombre
    };

    return this.http.post<void>(this.API, body)
      .pipe(
        catchError(this.handleError)
        ,
        // Redirigir al usuario al inicio-sesion después de haber sido registrado
        tap(() => this.router.navigate(['iniciar-sesion']))
      );
  }
   
  private handleError(error:HttpErrorResponse){
    if(error.status===409){
      console.error('Se ha producio un error ', error.error);
      return throwError(()=> new Error('El email pertenece a un usuario que ya ha sido registrado!'));
    }
    else{
      console.error('Backend retornó el código de estado ', error.status, error.error);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }
}
