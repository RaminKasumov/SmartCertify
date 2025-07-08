import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';
import { UserModel } from '../models/usermodel';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private baseUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) {}

  getUserProfile(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/${id}`);
  }
  updateProfile(formData: FormData) {
    return this.http.post(`${this.baseUrl}/updateProfile`, formData);
  }
}

