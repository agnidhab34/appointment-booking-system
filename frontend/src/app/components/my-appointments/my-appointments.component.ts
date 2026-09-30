import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment } from '../../models/models';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-appointments.component.html'
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  cancellingId: string | null = null;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load appointments.';
        this.loading = false;
      }
    });
  }

  get upcoming(): Appointment[] {
    return this.appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed');
  }

  get past(): Appointment[] {
    return this.appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  }

  serviceName(a: Appointment): string {
    return typeof a.serviceId === 'object' ? a.serviceId.name : 'Service';
  }

  providerName(a: Appointment): string {
    return typeof a.providerId === 'object' ? a.providerId.name : 'Provider';
  }

  cancel(a: Appointment): void {
    this.cancellingId = a._id;
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentService.updateStatus(a._id, 'cancelled').subscribe({
      next: () => {
        this.cancellingId = null;
        this.successMessage = 'Appointment cancelled.';
        this.load();
      },
      error: (err) => {
        this.cancellingId = null;
        this.errorMessage = err.error?.message || 'Failed to cancel appointment.';
      }
    });
  }
}
