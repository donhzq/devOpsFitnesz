import { Component, OnInit } from '@angular/core';
import { ServerService } from '../shared/services/server.service';
import { User } from '../shared/model/User';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule , MenuComponent , MatTableModule , MatIconModule,  MatDialogModule, MatSnackBarModule ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})


export class UserListComponent implements OnInit {
  users: any[] = [];
  Suser?: User;
  trainers: any[] = [];
  nontrainers: any[] = [];

  async ngOnInit(): Promise<void> {
    this.Suser = await this.authService.getUser();   

    this.serverService.listAllUsers().subscribe({
      next: (data)=>{
        if(data){
          this.users = data;

          this.trainers = this.users.filter(users => users.isTrainer == true);
          this.nontrainers = this.users.filter(users => users.isTrainer == false);

          console.log(data);
        }
      }, error: (err) => {
          console.log(err);
      },
    
    })

    console.log("session user " , this.Suser);
  }

  constructor( private serverService : ServerService , private authService : AuthService , private snackBar: MatSnackBar , private dialog: MatDialog , private router: Router ) {
   

  }

  deleteUser(id: string) {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.serverService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.openSnackBar('User deleted successfully.', 3000);
            }, error: (err) => {
              console.log(err);
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  makeTrainer(id: string){

    this.serverService.makeTrainer(id).subscribe({
      next: (data) => {
        console.log(data);

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/userList']);
        });
        
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, { duration: duration });
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/home']);
    });
  }
    
}