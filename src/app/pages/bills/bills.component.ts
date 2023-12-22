import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Gasto } from './bill';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'] // Corrección en el nombre de la propiedad
})
export class BillsComponent {

  g: Gasto = {
    id: '1',
    nombre: 'Comida'
  };
  gastos: Gasto[] = [this.g];
  idGrupo?: string; // Declaración de idGrupo

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });
  } // Corrección: Agregar corchete de cierre para el método ngOnInit

  agregarGasto() {
    console.log("Mostrar formulario de gasto");
    console.log(this.idGrupo)
    this.router.navigate(['formulario-gasto', this.idGrupo], { relativeTo: this.route });
  }
}
