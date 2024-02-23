import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { BillService } from '../../../services/bill/bill.service';
import { Gasto } from '../../bills/bill';
import { User } from '../../group/group';
import { BillSummary } from '../../../services/bill/billRequest';


@Component({
  selector: 'app-edit-bill-summary',
  templateUrl: './edit-bill-summary.component.html',
  styleUrl: './edit-bill-summary.component.css'
})
export class EditBillSummaryComponent {

  gasto?: Gasto ;
  id_gasto?: string;

  miembros: BillSummary[]=[]

  formaspago = [
    { id: '1', nombre: 'Partes iguales' },
    { id: '2', nombre: 'Porcentajes' },
    { id: '3', nombre: 'Partes desiguales' },
  ];

  billEditForm = this.fb.group({
    monto: [0, [Validators.required, this.montoMayorQueCeroValidator]],
    miembro:['',Validators.required],
    formapago: ['1',Validators.required],
    interests: this.fb.array([]),
  });

  montoMayorQueCeroValidator(control: FormControl) { 
    //Este validador chequea que el monto no sea negativo ni cero
    const monto = control.value;
    if (monto != null && monto <= 0) {
      return { 'montoInvalido': true };
    }
    return null;
  }
  
  constructor(private fb:FormBuilder, private router:Router, private route: ActivatedRoute, private billService: BillService) { 
  }
  ngOnInit(){
    //Me guardo el id que viene en la url
    this.route.params.subscribe(params => {
      this.id_gasto = params['idGasto']; // Asignación de idGrupo
    });
   
   this.billService.getGasto(this.id_gasto).subscribe(
    gasto => {
      this.gasto = gasto;
      this.miembros = this.gasto.participantes;
      // Cargo los formArray
      this.cargarFormulario();
      console.log("Gastos:",this.gasto)
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
  }

  cargarFormulario(){

    // Utilizando patchValue
      // Verificar si 'gasto' está definido y tiene un valor de 'monto'
      if (this.gasto && typeof this.gasto.monto !== 'undefined') {
        // Utilizar patchValue para asignar el valor de 'monto' al formulario
       
        //this.billEditForm.patchValue(this.monto:30, [this.montoMayorQueCeroValidator]);

        this.billEditForm.patchValue({
          monto: [this.gasto.monto, [Validators.required, this.montoMayorQueCeroValidator]],
          formapago: this.gasto.formaDivision,
          miembro: this.gasto.usuario
        });
      }
    
    // La cantidad específica de FormControl que deseas agregar
    const cantidadFormControl = this.miembros.length;
    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.addInterest(this.miembros[i].user_id, this.miembros[i].deuda); // es solo esta linea no?
    }
  }

  addInterest(id_user: string, deuda: number){
    //this.interests.push(this.fb.control('', [Validators.required, Validators.minLength(10)])) 
    //Esto tira un error de que no encuentra el nombre del controlador o algo asi
    const interestFormGroup = this.fb.group({
      user_id:[id_user , Validators.required],
      deuda:[deuda, Validators.required]
    })
    this.interests.push(interestFormGroup)
  }
  
   
  get monto(){
    return this.billEditForm.controls.monto;
  }

  get formapago(){
    return this.billEditForm.controls.formapago;
  }

  get miembro(){
    return this.billEditForm.controls.miembro;
  }
  
  get interests(){
    return this.billEditForm.get('interests') as FormArray;
  }


  

  editarGasto(){
    console.log("Bora te amo.")

  }

  chequearCambio(){

  }
}
