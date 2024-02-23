import { Component } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../../services/group/group.service';
import { GroupRequest } from '../../services/group/groupRequest';

@Component({
  selector: 'app-form-group',
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.css'
})
export class FormGroupComponent{
  categorias = [
    { id: '1', nombre: 'Viaje' },
    { id: '2', nombre: 'Fiesta' },
    { id: '3', nombre: 'Salida' },
    { id:'4', nombre: 'Otro'}
  ];

  groupError: string="";

  groupForm=this.formBuilder.group({
    nombre: ['',Validators.required],
    categoria:  ['',Validators.required],
    idUser: ['', []],
  })

  constructor(private formBuilder:FormBuilder, private router:Router, private groupService: GroupService) { 
  }

  get nombre(){
    return this.groupForm.controls.nombre;
  }

  createGroup(){
    if(this.groupForm.valid){
      this.groupError="";
      this.groupService.addGrupo(this.groupForm.value as GroupRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.groupError=errorData;
        },
        complete: () => {
          console.info("Se creo el grupo");
          this.router.navigateByUrl('/inicio/grupos');
          this.groupForm.reset();
        }
      })

    }
    else{
      this.groupForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
}
