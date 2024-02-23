import { Component } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { RegisterRequest } from '../../services/register/registerRequest';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerError:string="";
  registerForm=this.formBuilder.group({
    email:['',[Validators.required,Validators.email]],
    password: ['',Validators.required],
    nombre:['', Validators.required],
    apellido:['', Validators.required]
  })
  constructor(private formBuilder:FormBuilder, private router:Router, private registerService: RegisterService) { }

  get email(){
    return this.registerForm.controls.email;
  }

  get nombre(){
    return this.registerForm.controls.nombre;
  }

  get apellido(){
    return this.registerForm.controls.apellido;
  }

  get password()
  {
    return this.registerForm.controls.password;
  }

  register(){
    if(this.registerForm.valid){
      console.log("Registro usuario ", this.registerForm.value)
      this.registerError="";
      this.registerService.register(this.registerForm.value as RegisterRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.registerError=errorData;
        },
        complete: () => {
          console.info("Registro completado");
          this.router.navigateByUrl('/iniciar-sesion');
          this.registerForm.reset();
        }
      })

    }
    else{
      this.registerForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

}
