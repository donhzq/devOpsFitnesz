import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup , ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { MenuComponent } from '../menu/menu.component';
import { RouterModule , Router  } from '@angular/router';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule , MenuComponent , RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  regmsg: string = '';

  constructor(private formBuilder:FormBuilder , private authService : AuthService , private router: Router ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({

      email: ['' , [Validators.required , Validators.email]],
      name : [''],
      userName: [''],
      password : ['' , [Validators.required , Validators.minLength(6)]],
      cpassword : ['' , Validators.required]

    } , {
      validator: this.match('password' , 'cpassword')
    })
  }

  match(controlName: string ,controlName2: string ) {
    return (formGroup : FormGroup) => {
      const control = formGroup.controls[controlName];
      const mControl = formGroup.controls[controlName2];

      if(mControl.errors && mControl.errors['match']){
        return;
      }


      if(control.value !== mControl.value) {
        mControl.setErrors({match : true});
      }else{
        mControl.setErrors(null);
      }

    }

  }

  onSubmit(){

      if(this.signupForm.valid){

        this.authService.register(this.signupForm.value).subscribe({
          next: (data)=>{
            if(data){

              this.regmsg = 'Sikeres regisztráció';
              this.router.navigateByUrl('login')
              //console.log(data);
            }
          }, error: (err) => {
              console.log(err);
          },
        
        })

      }else{
        this.regmsg = 'Sikertelen regisztráció';
      }
      
  }
}
