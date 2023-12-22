import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import { BillService } from '../../../services/bill/bill.service';
import { BillRequest } from '../../../services/bill/billRequest';
import { Gasto } from './bill';

@Component({
  selector: 'app-form-bill',
  templateUrl: './form-bill.component.html',
  styleUrl: './form-bill.component.css'
})
export class FormBillComponent {
  formas_pago = [
    { id: '1', nombre: 'Partes iguales' }
  ];

  categorias = [
    { id: '1', nombre: 'Comida' },
    { id: '2', nombre: 'Hospedaje' }
  ];
  
  billError: string="";
  
  billForm=this.formBuilder.group({
    monto: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), this.noStringValidator]],
    categoria:  ['',Validators.required],
    formapago: ['',Validators.required],
    miembro:['',Validators.required]
  })

  constructor(private formBuilder:FormBuilder, private router:Router, private billService: BillService) { }

  noStringValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (typeof value === 'number') {
      return null; // Es un número, la validación pasa
    } else {
      return { 'noString': true }; // Es un string, la validación falla
    }
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
            formapago: this.billForm.get('formapago')?.value ?? '',
            miembro: this.billForm.get('miembro')?.value ?? ''
          };
  
          this.billService.addGasto(billRequest).subscribe({
            next: (userData) => {
              console.log(userData);
            },
            error: (errorData) => {
              console.error(errorData);
              this.billError = errorData;
            },
            complete: () => {
              console.info("Se creo el gasto");
              this.router.navigateByUrl('/inicio');
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
  
}


