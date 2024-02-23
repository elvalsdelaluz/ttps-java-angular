import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from '../../services/bill/bill.service';
import { Gasto } from './bill';
import { Subscription } from 'rxjs';
import { BillResponse } from '../../services/bill/billResponse';
import { LoginService } from '../../services/auth/login.service';
import { User } from '../../services/auth/user';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.css'] // Corrección en el nombre de la propiedad
})
export class BillsComponent {
  billService$?: Subscription;

  gastos: BillResponse[] = [];
  idGrupo?: string; // Declaración de idGrupo

  usuario?: User;

  constructor(private router: Router, private route: ActivatedRoute, private billService: BillService,
              private authService: LoginService) { 
  }

  ngOnInit() {
    this.usuario = this.authService.userValue;
    console.log("Estoy en bill este es el usuario: ", this.usuario);

    //Me guardo el id que viene en la url
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo']; // Asignación de idGrupo
    });
    console.log("Buscando gastos")

    // Llamada para obtener grupos
   this.billService.getGastos(this.idGrupo).subscribe(
    gastos => {
      this.gastos = gastos;
      console.log("Gastos:",this.gastos)
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
  } 

  agregarGasto() {
    const urlToNavigate = ['inicio/resumen-gasto', this.idGrupo];
    //console.log('Intento de navegación a:', this.router.createUrlTree(urlToNavigate).toString());
    // Ahora, realiza la navegación
    this.router.navigate(urlToNavigate);
  }

  editarGasto(idGasto: string){
    console.log("Editando gasto", idGasto);
    const urlToNavigate = ['inicio/editar-gasto', idGasto];
    this.router.navigate(urlToNavigate);
  }
}
