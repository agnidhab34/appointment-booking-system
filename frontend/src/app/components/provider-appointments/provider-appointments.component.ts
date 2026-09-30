import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../models/models';

@Component({
  selector: 'app-provider-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-appointments.component.html'
})
export class ProviderAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  updatingId: string | null = null;

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

  customerName(a: Appointment): string {
    return typeof a.customerId === 'object' ? a.customerId.name : 'Customer';
  }

  serviceName(a: Appointment): string {
    return typeof a.serviceId === 'object' ? a.serviceId.name : 'Service';
  }

  updateStatus(a: Appointment, status: AppointmentStatus): void {
    this.updatingId = a._id;
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentService.updateStatus(a._id, status).subscribe({
      next: () => {
        this.updatingId = null;
        this.successMessage = `Appointment ${status}.`;
        this.load();
      },
      error: (err) => {
        this.updatingId = null;
        this.errorMessage = err.error?.message || 'Failed to update appointment.';
      }
    });
  }
}
