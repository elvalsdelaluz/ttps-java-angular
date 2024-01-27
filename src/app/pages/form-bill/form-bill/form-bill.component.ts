import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from '../../../services/bill/bill.service';
import { BillRequest } from '../../../services/bill/billRequest';
import { User } from '../../group/group';

@Component({
  selector: 'app-form-bill',
  templateUrl: './form-bill.component.html',
  styleUrl: './form-bill.component.css'
})
export class FormBillComponent {
  formaspago = [
    { id: '1', nombre: 'Partes iguales' }
  ];

  categorias = [
    { id: '1', nombre: 'Comida' },
    { id: '2', nombre: 'Hospedaje' }
  ];

  miembros: User[]=[]
  
  billError: string="";
  
  billForm=this.formBuilder.group({
    monto: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), this.noStringValidator]],
    categoria:  ['',Validators.required],
    formapago: ['',Validators.required],
    miembro:['',Validators.required]
  })
  
  idGrupo?: string; // Declaración de idGrupo

  constructor(private formBuilder:FormBuilder, private router:Router, private route: ActivatedRoute, private billService: BillService) { }

  noStringValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (typeof value === 'number') {
      return null; // Es un número, la validación pasa
    } else {
      return { 'noString': true }; // Es un string, la validación falla
    }
  }

  get monto(){
    return this.billForm.controls.monto;
  }

  get formapago(){
    return this.billForm.controls.formapago;
  }

  get categoria(){
    return this.billForm.controls.categoria;
  }

  get miembro(){
    return this.billForm.controls.miembro;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });
    console.log("--------------Mostrando miembros-----------")
    console.log(this.miembros)
    this.billService.miembros$.subscribe((users) => {
      this.miembros = users;
    });
    console.log(this.miembros)
  } 

  createBill() {
    if (this.billForm.valid) {
      this.billError = "";
  
      // Realizar la conversión de monto aquí
      const montoValue = this.billForm.get('monto')?.value;
  
      if (montoValue !== null && montoValue !== undefined) {
        const montoNumerico = parseFloat(montoValue);
  
        if (!isNaN(montoNumerico)) {
          // La conversión fue exitosa, ahora puedes utilizar montoNumerico en tu BillRequest
          const billRequest: BillRequest = {
            monto: montoNumerico,
            categoria: this.billForm.get('categoria')?.value ?? '',
            formaPago: this.billForm.get('formapago')?.value ?? '',
            idUsuario: this.billForm.get('miembro')?.value ?? ''
          };
  
          this.billService.addGasto(billRequest, this.idGrupo).subscribe({
            next: (userData) => {
              console.log(userData);
            },
            error: (errorData) => {
              console.error(errorData);
              this.billError = errorData;
            },
            complete: () => {
              console.info("Se creo el gasto");
              const url = ['inicio/gastos/', this.idGrupo];
              this.router.navigate(url); //Deberia volver a gastos
              this.billForm.reset();
            }
          });
        } else {
          this.billError = "El monto debe ser un número válido.";
        }
      } else {
        this.billError = "El monto no puede ser nulo ni indefinido.";
      }
    } else {
      this.billForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }

  createBillSumarry() {
    console.log("Estoy en createBillSummary")
    console.log(this.billForm.valid)
  }
  
}


