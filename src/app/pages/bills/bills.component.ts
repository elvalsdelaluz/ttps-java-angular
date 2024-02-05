import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from '../../services/bill/bill.service';
import { Gasto } from './bill';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'] // Corrección en el nombre de la propiedad
})
export class BillsComponent {
  //28-1-2024
  data?: string;
  billService$?: Subscription;

  gastos: Gasto[] = [];
  idGrupo?: string; // Declaración de idGrupo

  constructor(private router: Router, private route: ActivatedRoute, private billService: BillService) { 
  this.billService.getData().subscribe({
    next: data => {
      this.data = data;
      console.log(this.data);
    },
    error: error => {
      this.data ='';
      console.log("Error al recuperar los datos")
    }
  })
  }

  ngOnInit() {
    //Me guardo el id que viene en la url
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });
    console.log("Buscando gastos")
    // Llamada para obtener grupos
   this.billService.getGastos(this.idGrupo).subscribe(
    gastos => {
      this.gastos = gastos;
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
  } 

  agregarGasto() {
    console.log("Mostrar formulario de gasto");
    console.log(this.idGrupo)
    const urlToNavigate = ['inicio/formulario-gasto', this.idGrupo];
    console.log('Intento de navegación a:', this.router.createUrlTree(urlToNavigate).toString());
    // Ahora, realiza la navegación
    this.router.navigate(urlToNavigate);
  }
}
