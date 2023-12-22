import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Gasto } from './bill';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrl: './bills.component.css'
})
export class BillsComponent {

  g: Gasto = {
    id:'1',
    nombre: 'Comida'
  };
  gastos: Gasto[]=[this.g];

  constructor(private router: Router, private route: ActivatedRoute) { }

  agregarGasto(){
    console.log("Mostrar formulario de gasto")
  }

}
