import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { User } from '../shared/model/User';
import { ServerService } from '../shared/services/server.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-join',
  standalone: true,
  imports: [CommonModule , MenuComponent],
  templateUrl: './group-join.component.html',
  styleUrl: './group-join.component.css'
})

export class GroupJoinComponent implements OnInit {
  groups: any[] = [];
  Suser?: User;
  msg: string ='';
  isFull : boolean = true;
  isJoined : boolean = false;

  joinGroup(id: string){
    if (this.Suser && this.Suser._id) {

    let actualGroup = this.groups.find(group => group._id === id);
    this.isFull = actualGroup.limit <= actualGroup.users.length;

    this.isJoined = actualGroup.users.includes(this.Suser._id) || (actualGroup.queue && actualGroup.queue.includes(this.Suser._id));

    if (this.isJoined) {
      this.msg = "Már csatlakozott ehhez a csoporthoz";
      return;
    }

    this.serverService.joinGroup(id , this.Suser?._id ,this.isFull).subscribe({

      next: (data) => {
        console.log(data);
       

          if(this.isFull){
            this.msg = "Sajnos megtelt a csoport, várólistára tettük";
          }else{
            this.msg = "Sikeresen csatlakozott";
          }

        
        setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/groupJoin']);
        });
        } ,1500)
      }, error: (err) => {
        console.log(err);
      }
    });
    }
  }



  async ngOnInit(): Promise<void> {

    if(this.Suser && this.Suser._id){
      this.msg = "A csatlakozáshoz kérem jeletkezzen be"
    }else{
      this.msg = '';

    }
    this.Suser = await this.authService.getUser();   

    this.serverService.listAllGroups().subscribe({
      next: (data)=>{
        if(data){
          this.groups = data;
          console.log(data);
        }
      }, error: (err) => {
          console.log(err);
      },
    
    })

    console.log("session user " , this.Suser);
  }

  constructor( private serverService : ServerService ,  private authService : AuthService ,  private router: Router ) {
   

  }

}
