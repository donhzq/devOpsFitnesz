import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { RouterModule , Router  } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MenuComponent } from '../menu/menu.component';
import { User } from '../shared/model/User';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule , CommonModule , RouterModule , MenuComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  userName: string = '';
  password: string ='';
  errorMessage: string = '';

  user?: User;
  

  constructor (private router: Router , private formBuilder:FormBuilder , private authService : AuthService) {
    
  }
  
  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getUser();   
  }
   
  //login megvalósítása
  login() { 

  

    if(this.userName && this.password){
      this.authService.login(this.userName , this.password).subscribe({
        next: (data)=>{
          if(data){
            //navigation
            this.router.navigateByUrl('home');
            console.log(data);
          }
        }, error: (err) => {
            console.log(err);
        },
      
      })
      
      this.errorMessage ='';
    }else {

      this.errorMessage = 'Hibás bejelentkezési adatok';
    }

  }

  navigate(to: string) {
    this.router.navigateByUrl(to);
  }

}

