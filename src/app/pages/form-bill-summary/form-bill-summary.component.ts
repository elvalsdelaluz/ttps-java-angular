import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, AbstractControl, FormControl, FormArray} from '@angular/forms';
import { Router} from '@angular/router';
import { BillService } from '../../services/bill/bill.service';

@Component({
  selector: 'app-form-bill-summary',
  templateUrl: './form-bill-summary.component.html',
  styleUrl: './form-bill-summary.component.css'
})
export class FormBillSummaryComponent {

  billError: string="";
  
  billFormEquals: FormGroup;
  
  constructor(private fb:FormBuilder, private router:Router, private billService: BillService) { 
     // Inicializa el formulario aquí
     this.billFormEquals = this.fb.group({
      billsArray: this.fb.array([], [this.customValidator])  // Segundo FormArray
    },
    );
  }

  customValidator(control: AbstractControl): ValidationErrors | null {
    // Aquí puedes implementar tu lógica de validación personalizada
    // Devuelve un objeto si la validación falla, o null si es válida
    console.log(control);
    if (false/* tu condición de validación */){
      return { customError: true };
    } else {
      return null;
    }
  }

  ngOnInit() {
    // Cargo los formArray
    this.cargarArray();
  }

  cargarArray(){
    // La cantidad específica de FormControl que deseas agregar
    const cantidadFormControl = 3;
    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.billsArray.push(new FormControl(''));
    }
    console.log("Array 1 cargado con input")
  }

  get billsArray(): FormArray {
    return this.billFormEquals.get('billsArray') as FormArray;
  }

}
