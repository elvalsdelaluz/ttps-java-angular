import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { BillService } from '../../services/bill/bill.service';
import { User } from '../group/group';
import { BillRequest, BillSummary } from '../../services/bill/billRequest';


@Component({
  selector: 'app-form-bill-summary',
  templateUrl: './form-bill-summary.component.html',
  styleUrl: './form-bill-summary.component.css'
})
export class FormBillSummaryComponent {

  billService$?: Subscription;

  miembros: User[]=[]

  formaspago = [
    { id: '1', nombre: 'Partes iguales' },
    { id: '2', nombre: 'Porcentajes' },
    { id: '3', nombre: 'Partes desiguales' },
  ];
  categorias = [
    { id: '1', nombre:'Combustible'},
    { id: '2', nombre:'Alojamiento'},
    { id: '3', nombre:'Tickets'},
    { id: '4', nombre:'Comida'},
   ]

  billError: string="";
  
  billForm = this.fb.group({
    monto: [0, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/), this.montoMayorQueCeroValidator]],
    miembro:['',Validators.required],
    formapago: ['1',Validators.required],
    categoria:['', Validators.required],
    interests: this.fb.array([], this.customArrayValidator.bind(this)),
  });

  idGrupo?: string;

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
    if ((array instanceof FormArray) && this.controlarValoresInputArray(array)) {
      return null;
    }
    return { superaElMaximo: true };
  }

  controlarValoresInputArray(array:FormArray): boolean {
    //Este metodo recorre el array (si la forma de pago es distinta
    //a 'partes iguales' y se ha ingresado un monto) chequeando que 
    //la suma de los input sea igual a 100 o igual al monto
    const formapagoControl = this.billForm?.get('formapago');
    if (formapagoControl instanceof FormControl && formapagoControl.value !== '1') {
      //Si la forma de pago no se ingreso retorna true,
      //no se muestra mensaje de error en el template
      
      const montoControl = this.billForm?.get('monto');
      if (montoControl instanceof FormControl && typeof montoControl.value === 'number') {
        //Si el monto no se ingreso retorna true,
        //no se muestra mensaje de error en el template
        const montoIngresado = montoControl.value;
    
        //Sumo los valores ingresados en los input
        let sumaControles = 0;
        for (let i = 0; i < array.length; i++) {
          const control = array.at(i) as FormGroup;
          const controlValue = control.get('deuda')?.value;
          //En caso de que no se haya ingresado un valor se suma 0
          if (typeof controlValue === 'number' || typeof controlValue === 'undefined') {
            sumaControles += controlValue || 0;
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

  
  ngOnInit() {
    //Recupero el id del grupo
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });

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
    const cantidadFormControl = this.miembros.length;
    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.addInterest(this.miembros[i].id); // es solo esta linea no?
    }
  }

  addInterest(id_user: string){
    //this.interests.push(this.fb.control('', [Validators.required, Validators.minLength(10)])) 
    //Esto tira un error de que no encuentra el nombre del controlador o algo asi
    const interestFormGroup = this.fb.group({
      user_id:[id_user , Validators.required],
      deuda:[0, Validators.required]
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
        const result = montoIngresado / this.miembros.length;
        
        //ACA TENGO QUE ITERAR EN EL ARRAY DE BILLRRAY
        const interestsArray = this.billForm.get('interests') as FormArray;
        for (let i = 0; i < interestsArray.length; i++) {
          const control = interestsArray.at(i) as FormGroup;
          control.patchValue({ deuda: result});
        }
    }
    else if (this.formapago.value === '2' || this.formapago.value === '3') {
        //limpiar input
       // Obtener la referencia al FormArray
        const interestsArray = this.billForm.get('interests') as FormArray;
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


  createBill(){
    if (this.billForm.valid) {
      console.log("CREANDO GASTO")
      const montoControl = this.billForm.get('monto');
      let montoIngresado: number | undefined;
      if (montoControl && typeof montoControl.value === 'number') {
        montoIngresado = montoControl.value;
      }
      const interestsValue = this.billForm.get('interests')?.value as BillSummary[];
      const billRequest: BillRequest = {
        monto: montoIngresado || 0,
        //categoria: this.billForm.get('categoria')?.value ?? '',
        formapago: this.billForm.get('formapago')?.value ?? '',
        miembro: this.billForm.get('miembro')?.value ?? '',
        interests: interestsValue
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
