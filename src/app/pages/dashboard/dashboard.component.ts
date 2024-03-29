import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { GroupService } from '../../services/group/group.service';
import { User } from '../../services/auth/user';
import { Grupo } from '../group/group';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userLoginOn:boolean=false;
  //userData?:User;

  constructor(private loginService:LoginService, private groupService:GroupService) { }

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next:(userLoginOn) => {
        this.userLoginOn=userLoginOn;
      }
    });
 
   // this.loginService.currentUserData.subscribe({
    //  next:(userData)=>{
   //     this.userData=userData;
    //  }
 //   })
  }

  viewHome(){

  }

  viewGroups(){

  }

  viewFriends(){

  }

  viewActivities(){

  }

}