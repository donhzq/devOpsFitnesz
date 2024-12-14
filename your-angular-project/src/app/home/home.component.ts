import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { User } from '../shared/model/User';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

 
}

