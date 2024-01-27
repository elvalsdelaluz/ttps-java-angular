import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-formulario2',
  templateUrl: './formulario2.component.html',
  styleUrl: './formulario2.component.css'
})
export class Formulario2Component {
  formaspago = [
    { id: '1', nombre: 'Partes iguales' },
    { id: '2', nombre: 'Porcentaje' }
  ];

  calculatorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializa el formulario aquí
    this.calculatorForm = this.fb.group({
      number1: [0, Validators.required],
      formapago: ['',Validators.required],
      result: [0],
      formArray1: this.fb.array([]), // Primer FormArray
      formArray2: this.fb.array([], [this.customValidator])  // Segundo FormArray
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

  sumPromedio100(formArrayName: string) {
    console.log("VALIDACION SUMA INPUT DE PROMEDIO");
    return (form: FormGroup) => {
      const control = form.get(formArrayName) as FormArray | null;
  
      if (control && control.errors) {
        console.log("Hay errores anteriores en el formulario");
        return;
      }
  
      let suma = 0;
      if (control) {
        for (let i = 0; i < control.length; i++) {
          suma = suma + control.at(i).value;
          console.log(control.at(i).value);
        }
      }
  
      if (suma === 100) {
        control?.setErrors({ mustMatch: true });
      } else {
        control?.setErrors(null);
      }
    };
  }
  
  
  

  cargarArray1(){
    
    // La cantidad específica de FormControl que deseas agregar
    const cantidadFormControl = 3;

    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.formArray1.push(new FormControl(''));
    }
    console.log("Array 1 cargado con input")

  }

  cargarArray2(){
    // La cantidad específica de FormControl que deseas agregar
    const cantidadFormControl = 2;

    // Iterar para agregar FormControl al FormArray
    for (let i = 0; i < cantidadFormControl; i++) {
      this.formArray2.push(new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]));
    }
    console.log("Array 2 cargado con input")

  }


  ngOnInit() {
    // Observa cambios en los números y actualiza el resultado
    this.calculatorForm.get('number1')?.valueChanges.subscribe(() => this.updateResult());
    // Cargo los formArray
    this.cargarArray1();
    this.cargarArray2();
  }

  updateResult() {
    const num1 = parseFloat(this.calculatorForm.get('number1')?.value);

    // Verifica si ambos números son válidos
    if (!isNaN(num1)) {
      const result = num1 / 3;
      this.calculatorForm.get('result')?.setValue(result);
      //ACA TENGO QUE ITERAR EN EL ARRAY DE FORMARRAY1
      for (let i = 0; i < this.formArray1.length; i++) {
        // Utiliza setValue para cambiar el valor de cada FormControl en el FormArray
        this.formArray1.at(i).setValue(result);
        console.log(this.formArray1.at(i).value)
      }
      

    } else {
      // Si alguno de los números no es válido, muestra un mensaje de error
      this.calculatorForm.get('result')?.setValue('Error');
    }
  }

  get formArray1(): FormArray {
    return this.calculatorForm.get('formArray1') as FormArray;
  }

  get formArray2(): FormArray {
    return this.calculatorForm.get('formArray2') as FormArray;
  }


}