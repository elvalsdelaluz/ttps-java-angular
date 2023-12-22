import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group/group.service';
import { Grupo } from './group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  providers: [ GroupService ],
  styleUrl: './group.component.css'
})
export class GroupComponent implements OnInit {

constructor(private grupoService: GroupService, private router: Router, private route: ActivatedRoute) { }

g: Grupo = {
  id:'1',
  nombre: 'Cordoba'
};
grupos: Grupo[]=[this.g];

EditarGrupo(): void{
  //este mepa q no va aca
  console.log("Mostrar formulario de edicion grupo")
}

agregarGrupo() {
  console.log("Hay que mostrar el formulario de grupo")
  this.router.navigate(['formulario-grupo'], { relativeTo: this.route });
}

VerGastos() {
  console.log("Mostrar gastos")
  this.router.navigate(['gastos', this.g.id], { relativeTo: this.route });
}

ngOnInit(): void {
   // Llamada para obtener grupos
   this.grupoService.getGrupos().subscribe(
    grupos => {
      this.grupos = grupos;
    },
    error => {
      console.error('Error al obtener grupos', error);
    }
    );
}

}
