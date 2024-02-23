import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../services/group/group.service';
import { User } from '../group/group';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.component.html',
  styleUrl: './add-friends.component.css'
})
export class AddFriendsComponent {
  //Tengo que recuperar los usuarios del sistema y mostrarlos
  usuarios: User[]=[];
  idGrupo: string = "";

  constructor(private groupService: GroupService, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idGrupo = params['idGrupo'];
      console.log("Estoy en el componen1te add-friends, el valor de idGrupo es: ", this.idGrupo)
    });
    this.cargarParticipantes();
  }

  cargarParticipantes(){
    // Llamada para obtener los usuarios que no estan en el grupo
    this.groupService.getNotUsersGroup(this.idGrupo).subscribe(
      usuarios => {
        this.usuarios = usuarios;
        console.log(usuarios); 
      },
      error => {
        console.error('Error al obtener los usuarios', error);
      }
      );
  }

  agregarParticipante(user: User){
      this.groupService.addFriendToGroup(this.idGrupo, user).subscribe(
        grupo => {
          console.log(grupo);
          console.log("Se añadio al participante!")
          this.cargarParticipantes();
        },
        error => {
          console.error('Error al agregar al participante', error);
        }
      )
  }





}
