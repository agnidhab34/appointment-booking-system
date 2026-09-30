import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(providerId?: string): Observable<Service[]> {
    const url = providerId ? `${this.apiUrl}?providerId=${providerId}` : this.apiUrl;
    return this.http.get<Service[]>(url);
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`);
  }

  createService(data: Partial<Service>): Observable<Service> {
    return this.http.post<Service>(this.apiUrl, data);
  }

  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.apiUrl}/${id}`, data);
  }

  deleteService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
