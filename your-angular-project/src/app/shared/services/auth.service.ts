import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { environment } from '../../../environments/environment'; // Importálás

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  user?: User;

  constructor(private http: HttpClient ) { 
     this.getUser();
  }

  // Login
  login(userName: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', userName);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${environment.apiUrl}/login`, body.toString(), { headers: headers, withCredentials: true });
  }

  // Register
  register(user: User) {
    const body = new URLSearchParams();
    body.set('userName', user.userName);
    body.set('name', user.name);
    body.set('password', user.password);
    body.set('email', user.email);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${environment.apiUrl}/register`, body.toString(), { headers: headers });
  }

  // Logout
  logout() {
    return this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true, responseType: 'text' });
  }

  // Check Authentication
  checkAuth() {
    return this.http.get<boolean>(`${environment.apiUrl}/checkAuth`, { withCredentials: true });
  }

  // Get User
  async getUser(): Promise<any> {
    try {
      this.user = await this.http.get<User>(`${environment.apiUrl}/getUser`, { withCredentials: true }).toPromise();
      sessionStorage.setItem('user', JSON.stringify(this.user));
      return this.user;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }
}
