import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { BillService } from '../../../services/bill/bill.service';
import { Gasto } from '../../bills/bill';
import { User } from '../../group/group';
import { BillSummary } from '../../../services/bill/billRequest';
import { BillResponse, Deuda } from '../../../services/bill/billResponse';
import { BillRequest } from '../../../services/bill/billRequest';


@Component({
  selector: 'app-edit-bill-summary',
  templateUrl: './edit-bill-summary.component.html',
  styleUrl: './edit-bill-summary.component.css'
})
export class EditBillSummaryComponent {

  gasto?: BillResponse ;
  id_gasto?: string;
  id_grupo?: string;

  miembros: Deuda[] = [];

  formaspago = [
    { id: '1', nombre: 'Partes iguales' },
    { id: '2', nombre: 'Porcentajes' },
    { id: '3', nombre: 'Partes desiguales' },
  ];

  billEditForm = this.fb.group({
    monto: [0, [Validators.required, this.montoMayorQueCeroValidator]],
    miembro:['',Validators.required],
    formapago: ['',Validators.required],
    interests: this.fb.array([], this.customArrayValidator.bind(this)),
  });

  montoMayorQueCeroValidator(control: FormControl) { 
    //Este validador chequea que el monto no sea negativo ni cero
    const monto = control.value;
    if (monto != null && monto <= 0) {
      return { 'montoInvalido': true };
    }
    return null;
  }

  customArrayValidator(array: AbstractControl): { [key: string]: any } | null {
    //Este validador retorna true si los input del array no suman el valor
    //correpondiente según la forma de pago
    console.log("VALIDANDO RESUMENNNN externo")
    if ((array instanceof FormArray) && this.controlarValoresInputArray(array)) {
      return null;
    }
    return { superaElMaximo: true };
  }

  controlarValoresInputArray(array:FormArray): boolean {
    console.log("VALIDANDO RESUMENNNN INTERNO")
    //Este metodo recorre el array (si la forma de pago es distinta
    //a 'partes iguales' y se ha ingresado un monto) chequeando que 
    //la suma de los input sea igual a 100 o igual al monto
    const formapagoControl = this.billEditForm?.get('formapago');
    if (formapagoControl instanceof FormControl && formapagoControl.value !== '1') {
      //Si la forma de pago no se ingreso retorna true,
      //no se muestra mensaje de error en el template
      console.log("forma pago es <> 1")
      const monto =  Number(this.billEditForm.get('monto')?.value) ?? 0 //ESSTO DE NUEVO ME SALVO LAS PAPAS
    
      if (monto) {
        //Si el monto no se ingreso retorna true,
        //no se muestra mensaje de error en el template
        const montoIngresado = monto;
        console.log("monto", montoIngresado)
    
        //Sumo los valores ingresados en los input
        let sumaControles = 0;
        for (let i = 0; i < array.length; i++) {
          const control = array.at(i) as FormGroup;
          const controlValue = control.get('deuda')?.value;
          //En caso de que no se haya ingresado un valor se suma 0
          if (typeof controlValue === 'number' || typeof controlValue === 'undefined') {
            sumaControles += controlValue || 0;
            console.log("suma montos controles: ", sumaControles)
          }
        }
        
        //Comparo la suma total con el valor esperado según la forma de pago seleccionada
        if ((formapagoControl.value === '3' && sumaControles !== montoIngresado) || (formapagoControl.value === '2' && sumaControles !== 100)) {
          return  false ;
        }
      }
    }
    return true;
  }
  
  constructor(private fb:FormBuilder, private router:Router, private route: ActivatedRoute, private billService: BillService) { 
  }
  ngOnInit(){
    //Me guardo el id que viene en la url
    this.route.params.subscribe(params => {
      this.id_gasto = params['idGasto']; // Asignación de idGasto
    });
    this.route.params.subscribe(params => {
      this.id_grupo = params['idGrupo']; // Asignación de idGrupo
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

    // Observa cambios en los números y actualiza el resultado
    this.billEditForm.get('monto')?.valueChanges.subscribe(() => this.updateResult());
    this.billEditForm.get('formapago')?.valueChanges.subscribe(() => this.updateResult());
  }

  cargarFormulario(){

    // Utilizando patchValue
      // Verificar si 'gasto' está definido y tiene un valor de 'monto'
      if (this.gasto && typeof this.gasto.monto !== 'undefined') {
        // Utilizar patchValue para asignar el valor de 'monto' al formulario
       
        //this.billEditForm.patchValue(this.monto:30, [this.montoMayorQueCeroValidator]);

        this.billEditForm.patchValue({
          monto: [this.gasto.monto],
          formapago: this.gasto.formaDivision,
          miembro: this.gasto.usuario.id
        });
      }
    if (this.miembros){
        // La cantidad específica de FormControl que deseas agregar
        const cantidadFormControl = this.miembros?.length || 0;
       // Iterar para agregar FormControl al FormArray
        for (let i = 0; i < cantidadFormControl; i++) {
          let monto = this.miembros[i].monto
          if (this.gasto?.formaDivision == "2"){
            monto = (monto * 100) / this.gasto.monto;
            console.log("ESTE ES EL PORCENTAJE: ", monto);
          }
          this.addInterest(this.miembros[i].usuario.id, monto); // es solo esta linea no?
        }
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

  updateResult2() {
    const montoControl = this.billEditForm.get('monto');
  
    let montoIngresado: number | undefined;
    if (montoControl && typeof montoControl.value === 'number') {
      montoIngresado = montoControl.value;
    }
    console.log("-------------------------------------")
    console.log("this.monto.value", this.monto.value?.[0])
    console.log("this.formapago.value",this.formapago.value)
    console.log("-------------------------------------")

    // Verificar si montoIngresado no es undefined antes de realizar operaciones aritméticas   
    if (montoIngresado !== undefined) {
      this.resetearInput(montoIngresado);
    }

  }

  updateResult(){
    const montoActual = this.monto.value?.[0] as number;
    console.log("UPDATE RESULT",  this.monto.value?.[0])
    if (! montoActual){
      console.log("No entra porque es cero y cero es false");
    }
    console.log(this.monto.value)
    if (montoActual){
      this.resetearInput(montoActual);
    }

  }
  
  resetearInput(montoIngresado:number){
    console.log(this.formapago.value)
    if (this.formapago.value === '1'){
      console.log("Estoy en pago por division iguales")
      //Recorro el array interest 
      const result = montoIngresado / this.miembros.length;
        
      //ACA TENGO QUE ITERAR EN EL ARRAY DE BILLRRAY
      const interestsArray = this.billEditForm.get('interests') as FormArray;
      for (let i = 0; i < interestsArray.length; i++) {
        const control = interestsArray.at(i) as FormGroup;
        control.patchValue({ deuda: result});
      }  
    }
    else if (this.formapago.value === '2' || this.formapago.value === '3') {
        //limpiar input
       // Obtener la referencia al FormArray
        const interestsArray = this.billEditForm.get('interests') as FormArray;
        // Iterar sobre los controles y resetear cada uno
        interestsArray.controls.forEach((control) => {
          // Resetear el control
          //control.reset(); este me limpia todo
          const deudaControl = control.get('deuda');
          if (deudaControl) {
            deudaControl.reset();
          }
        });
    }
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
    console.log("Bora te amo.");
    console.log(this.billEditForm.value);
    if (this.billEditForm.valid) {
      console.log("EDITANDO GASTO")

      const interestsValue = this.billEditForm.get('interests')?.value as BillSummary[];
      const billRequest: BillRequest = {
        monto: Number(this.billEditForm.get('monto')?.value) ?? 0, //ESTO SOLUCIONO EL PROBLEMA DE QUE SE GUARDE 0
        //categoria: this.billForm.get('categoria')?.value ?? '',
        formapago: this.billEditForm.get('formapago')?.value ?? '',
        miembro: this.billEditForm.get('miembro')?.value ?? '',
        interests: interestsValue
      };
      this.billService.editGasto(billRequest, this.id_gasto).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
        },
        complete: () => {
          console.info("Edito el gasto");
          const url = ['inicio/gastos/', this.id_grupo];
          this.router.navigate(url); //Deberia volver a gastos
          //this.billEditForm.reset();
        }
      });
    }
    else {
      this.billEditForm.markAllAsTouched();
      alert("Error al ingresar los datos.");
    }

  }

  volverAGastos(){
    const url = ['inicio/gastos/', this.id_grupo];
    this.router.navigate(url); //Deberia volver a gastos
  }

  chequearCambio(){

  }
}
