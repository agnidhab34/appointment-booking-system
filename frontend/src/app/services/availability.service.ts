import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Availability } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private apiUrl = `${environment.apiUrl}/availability`;

  constructor(private http: HttpClient) {}

  getAvailability(providerId?: string, date?: string, includeBooked = false): Observable<Availability[]> {
    const params: string[] = [];
    if (providerId) params.push(`providerId=${providerId}`);
    if (date) params.push(`date=${date}`);
    if (includeBooked) params.push(`includeBooked=true`);
    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Availability[]>(`${this.apiUrl}${query}`);
  }

  createAvailability(data: { date: string; startTime: string; endTime: string }): Observable<Availability> {
    return this.http.post<Availability>(this.apiUrl, data);
  }

  deleteAvailability(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
