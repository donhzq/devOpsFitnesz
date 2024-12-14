import { Component, OnInit } from '@angular/core';
import { RouterModule , Router  } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { User } from '../shared/model/User';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule , CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent  implements OnInit{

  user?: User;

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();   
  }

  constructor (private router: Router , private authService : AuthService) {
  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

  logout() {
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigateByUrl('/login');
      }, error: (err) => {
        console.log(err);
      }
    });
  }


}


