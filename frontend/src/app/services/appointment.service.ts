import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment, AppointmentStatus } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  createAppointment(data: { providerId: string; serviceId: string; slotId: string }): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data);
  }

  getAppointments(status?: AppointmentStatus): Observable<Appointment[]> {
    const url = status ? `${this.apiUrl}?status=${status}` : this.apiUrl;
    return this.http.get<Appointment[]>(url);
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: AppointmentStatus): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, { status });
  }

  deleteAppointment(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
