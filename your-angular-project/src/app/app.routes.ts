import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './shared/guards/auth.guard';


export const routes: Routes = [
    {path : 'login' , loadComponent : ()=> import('./login/login.component').then((c)=>c.LoginComponent)},
    {path : 'signup' , loadComponent : ()=> import('./signup/signup.component').then((c)=>c.SignupComponent)},
    {path : 'groups' , loadComponent : ()=> import('./groups/groups.component').then((c)=>c.GroupsComponent)},
    //{path : 'userList' , loadComponent : ()=> import('./user-list/user-list.component').then((c)=>c.UserListComponent)},
    {path : 'groupJoin' , loadComponent : ()=> import('./group-join/group-join.component').then((c)=>c.GroupJoinComponent)},
    {path: 'userList', loadComponent: () => import('./user-list/user-list.component').then((c) => c.UserListComponent), canActivate: [authGuard] },
    {path : '**' ,  loadComponent : ()=> import('./home/home.component').then((c)=>c.HomeComponent)}
];
