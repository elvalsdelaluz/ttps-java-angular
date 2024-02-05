import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, FormControl, FormArray} from '@angular/forms';
import { Router} from '@angular/router';
import { BillService } from '../../services/bill/bill.service';
import { User } from '../group/group';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-bill-summary',
  templateUrl: './form-bill-summary.component.html',
  styleUrl: './form-bill-summary.component.css'
})
export class FormBillSummaryComponent {

  billService$?: Subscription;

  miembros: User[]=[]

  miembros2 = [
    { id: '1', email: 'Ana' },
    { id: '2', email: 'Lujan' },
    { id: '3', email: 'Ivan' }
  ];
  
  formaspago = [
    { id: '1', nombre: 'Partes iguales' },
    { id: '2', nombre: 'Porcentajes' },
  ];

  billError: string="";
  
  billForm = this.fb.group({
    monto: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), this.montoMayorQueCeroValidator]],
    miembro:['',Validators.required],
    formapago: ['1',Validators.required],
    interests: this.fb.array([], this.customArrayValidator.bind(this)), //this.customArrayValidator
  });

  montoMayorQueCeroValidator(control: FormControl) { //Este hay que eliminarlo
    const monto = control.value;
    console.log("El monto es: ", monto)
    if (monto != null && monto <= 0) {
      return { 'montoInvalido': true };
    }
    return null;
  }

  customArrayValidator(array: AbstractControl): { [key: string]: any } | null {
    if ((array instanceof FormArray) && this.controlarValoresInputArray(array)) {
      return null;
    }
  
    console.log("validando...");
  
    return { superaElMaximo: true };
  }

  controlarValoresInputArray2(): boolean{
    return false;
  }

  controlarValoresInputArray(array:FormArray): boolean {
    const formapagoControl = this.billForm?.get('formapago');
    
    if (formapagoControl instanceof FormControl && formapagoControl.value !== '1') {
      const montoControl = this.billForm?.get('monto');
      
      if (montoControl instanceof FormControl && typeof montoControl.value === 'number') {
        const montoIngresado = montoControl.value;
        console.log("Tengo que sumar los valores ingresados en los input");
        // Resto del código

        let sumaControles = 0;
  
        for (let i = 0; i < array.length; i++) {
          const control = array.at(i) as FormGroup;
          const controlValue = control.get('algo')?.value;
      
          if (typeof controlValue === 'number' || typeof controlValue === 'undefined') {
            sumaControles += controlValue || 0;
          }
        }
      
        if ((formapagoControl.value === '3' && sumaControles !== montoIngresado) || (formapagoControl.value === '2' && sumaControles !== 100)) {
          return  false ;
        }
      }
    }
    return true;
  }
  

  customArrayValidator2(array: AbstractControl): { [key: string]: any } | null {
    if (!array || !(array instanceof FormArray)) {
      return null;  // O devuelve un error si es apropiado en tu caso
    }
  
    const formapago = this.billForm.get('formapago')?.value;
    //const montoControl = this.billForm.get('monto');
    const montoControl = this.billForm ? this.billForm.get('monto') : null;

    
    let montoIngresado: number | undefined;
  
    if (montoControl && typeof montoControl.value === 'number') {
      montoIngresado = montoControl.value;
    }
  
    let sumaControles = 0;
  
    for (let i = 0; i < array.length; i++) {
      const control = array.at(i) as FormGroup;
      const controlValue = control.get('algo')?.value;
  
      if (typeof controlValue === 'number' || typeof controlValue === 'undefined') {
        sumaControles += controlValue || 0;
      }
    }
  
    if ((formapago === '1' && sumaControles !== montoIngresado) || (formapago === '2' && sumaControles !== 100)) {
      return { superaElMaximo: true };
    }
  
    // Si no hay errores, retorna null
    return null;
  }
  
  
  constructor(private fb:FormBuilder, private router:Router, private billService: BillService) { 
  }

  
  ngOnInit() {
    //Recupero los miembros del grupo
    this.billService.miembros$.subscribe((users) => {
      this.miembros = users;
      console.log("Estos son los miembros",this.miembros);
    });

    // Cargo los formArray
    this.cargarArray();

     // Observa cambios en los números y actualiza el resultado
     this.billForm.get('monto')?.valueChanges.subscribe(() => this.updateResult());
     this.billForm.get('formapago')?.valueChanges.subscribe(() => this.updateResult());
  }

  cargarArray(){
    // La cantidad específica de FormControl que deseas agregar
    const cantidadFormControl = this.miembros2.length;
    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.addInterest(); // es solo esta linea no?
    }
  }

  addInterest(){
    //this.interests.push(this.fb.control('', [Validators.required, Validators.minLength(10)]))
    const interestFormGroup = this.fb.group({
      algo:['', Validators.required]
    })
    this.interests.push(interestFormGroup)
  }

  updateResult() {
    const montoControl = this.billForm.get('monto');
    
    let montoIngresado: number | undefined;
  
    if (montoControl && typeof montoControl.value === 'number') {
      montoIngresado = montoControl.value;
    }
  
    // Verificar si montoIngresado no es undefined antes de realizar operaciones aritméticas   
    if (montoIngresado !== undefined) {
      this.resetearInput(montoIngresado);
    }
  }
  
  resetearInput(montoIngresado:number){
    if (this.formapago.value === '1'){
      console.log("Estoy en pago por division iguales")
        //Recorro el array interest 
        const result = montoIngresado / this.miembros2.length;
        
        //ACA TENGO QUE ITERAR EN EL ARRAY DE BILLRRAY
        const interestsArray = this.billForm.get('interests') as FormArray;
        for (let i = 0; i < interestsArray.length; i++) {
          const control = interestsArray.at(i) as FormGroup;
          control.patchValue({ algo: result});
        }
    }
    else if (this.formapago.value === '2' || this.formapago.value === '3') {
        //limpiar input
       // Obtener la referencia al FormArray
        const interestsArray = this.billForm.get('interests') as FormArray;

        // Iterar sobre los controles y resetear cada uno
        interestsArray.controls.forEach((control) => {
          // Resetear el control
          control.reset();
        });

    }
  }


  createBill(){
    if (this.billForm.valid) {
      console.log("CREANDO GASTO")
    }
    else {
      this.billForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }
  }
  
  get monto(){
    return this.billForm.controls.monto;
  }

  get formapago(){
    return this.billForm.controls.formapago;
  }

  get miembro(){
    return this.billForm.controls.miembro;
  }
  
  get interests(){
    return this.billForm.get('interests') as FormArray;
  }
  
}
