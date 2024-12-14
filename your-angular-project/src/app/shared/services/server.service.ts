import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { environment } from '../../../environments/environment'; // Importálás

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) { }

  listAllUsers(){
    return this.http.get<User[]>(`${environment.apiUrl}/getAllUsers`, { withCredentials: true });
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/deleteUser?id=${id}`, { withCredentials: true });
  }

  makeTrainer(id: string) {
    return this.http.post(`${environment.apiUrl}/makeTrainer?id=${id}`, {}, { withCredentials: true });
  }

  createGroup(trainer: string, name: string, limit: number ) {
    const body = new URLSearchParams();
    body.set('trainer', trainer);
    body.set('name', name);
    body.set('limit', limit.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${environment.apiUrl}/createGroup`, body.toString(), { headers: headers });
  }

  listAllGroups(){
    return this.http.get<User[]>(`${environment.apiUrl}/getAllGroups`, { withCredentials: true });
  }

  joinGroup(id: string, userId: string, isFull: boolean) {
    const body = new URLSearchParams();
    body.set('id', id);
    body.set('userId', userId);
    body.set('isFull', isFull ? 'true' : '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${environment.apiUrl}/joinGroup`, body.toString(), { headers: headers });
  }
}
