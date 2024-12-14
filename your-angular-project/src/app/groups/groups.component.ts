import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { ServerService } from '../shared/services/server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [MenuComponent , ReactiveFormsModule , CommonModule , FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {

  name: string ="";
  trainer: string ="";
  limit: number = 0;
  allUsers: any[] = [];
  allTrainers : any [] = [];
  constructor( private serverService : ServerService , private authService : AuthService ,private router: Router ) {
  
  }

  createGroup() {

    this.serverService.createGroup(this.trainer , this.name , this.limit).subscribe({
      next: (data)=>{
        if(data){
          //navigation
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/groupJoin']);
          });
          console.log(data);
        }
      }, error: (err) => {
          console.log(err);
      },
    
    })

  }

  ngOnInit() {
    this.serverService.listAllUsers().subscribe({
      next: (data)=>{
        if(data){
          this.allUsers = data;
          this.allTrainers = this.allUsers.filter(allUsers => allUsers.isTrainer == true);
          console.log(data);
        }
      }, error: (err) => {
          console.log(err);
      },
    
    })
   
  }


}



