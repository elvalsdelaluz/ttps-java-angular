import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group/group.service';
import { Grupo, User } from './group';
import { BillService } from '../../services/bill/bill.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  providers: [ GroupService ],
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {

grupos: Grupo[]=[];

constructor(private grupoService: GroupService, private billService: BillService, private router: Router, private route: ActivatedRoute) { }

EditarGrupo(): void{
  //este mepa q no va aca
  console.log("Mostrar formulario de edicion grupo")
}

agregarParticipante(idGrupo:string):void{
  //console.log("Muestro model para agregar un participante: ")
  const url = ['inicio/agregar-participante', idGrupo];
  this.router.navigate(url);
}


agregarGrupo() {
  this.router.navigate(['inicio/formulario-grupo']);
}

VerGastos(id_grupo: string, miembros: User[]) {
  //Antes de mostrar la lista de gastos actualizo la lista de miembros
  this.billService.updateUserList(miembros);
  this.router.navigate(['inicio/gastos', id_grupo]);
}

ngOnInit(): void {
   // Llamada para obtener grupos
   this.grupoService.getGrupos().subscribe(
    grupos => {
      this.grupos = grupos;
      console.log("Estos son los grupos:",grupos); 
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
}

}
