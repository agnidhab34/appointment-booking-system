import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { AvailabilityService } from '../../services/availability.service';
import { AppointmentService } from '../../services/appointment.service';
import { Availability, Service } from '../../models/models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html'
})
export class BookAppointmentComponent implements OnInit {
  service: Service | null = null;
  serviceId = '';
  providerId = '';

  selectedDate = '';
  slots: Availability[] = [];
  slotsLoading = false;

  booking = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService,
    private availabilityService: AvailabilityService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('serviceId') || '';
    if (!this.serviceId) {
      this.errorMessage = 'Invalid service selected.';
      return;
    }

    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (data) => {
        this.service = data;
        this.providerId = typeof data.providerId === 'object' ? data.providerId._id : data.providerId;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load service.';
      }
    });
  }

  onDateChange(): void {
    if (!this.selectedDate || !this.providerId) return;

    this.slotsLoading = true;
    this.slots = [];
    this.errorMessage = '';

    this.availabilityService.getAvailability(this.providerId, this.selectedDate).subscribe({
      next: (data) => {
        this.slots = data;
        this.slotsLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load available slots.';
        this.slotsLoading = false;
      }
    });
  }

  bookSlot(slot: Availability): void {
    this.booking = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentService
      .createAppointment({ providerId: this.providerId, serviceId: this.serviceId, slotId: slot._id })
      .subscribe({
        next: () => {
          this.booking = false;
          this.successMessage = 'Appointment booked successfully!';
          setTimeout(() => this.router.navigate(['/customer/appointments']), 1200);
        },
        error: (err) => {
          this.booking = false;
          this.errorMessage = err.error?.message || 'Failed to book appointment. The slot may no longer be available.';
          // Refresh slots since this one may now be taken
          this.onDateChange();
        }
      });
  }
}
