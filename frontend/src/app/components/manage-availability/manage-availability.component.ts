import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AvailabilityService } from '../../services/availability.service';
import { AuthService } from '../../services/auth.service';
import { Availability } from '../../models/models';

@Component({
  selector: 'app-manage-availability',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-availability.component.html'
})
export class ManageAvailabilityComponent implements OnInit {
  private fb = inject(FormBuilder);

  slots: Availability[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  form = this.fb.nonNullable.group({
    date: ['', Validators.required],
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  });

  constructor(
    private availabilityService: AvailabilityService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const providerId = this.auth.currentUser()?.id;
    this.availabilityService.getAvailability(providerId, undefined, true).subscribe({
      next: (data) => {
        this.slots = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load availability.';
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { date, startTime, endTime } = this.form.getRawValue();

    if (startTime! >= endTime!) {
      this.errorMessage = 'Start time must be before end time.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.availabilityService.createAvailability({ date: date!, startTime: startTime!, endTime: endTime! }).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Slot added.';
        this.form.reset({ date: '', startTime: '', endTime: '' });
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to add slot.';
      }
    });
  }

  delete(slot: Availability): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.availabilityService.deleteAvailability(slot._id).subscribe({
      next: () => {
        this.successMessage = 'Slot deleted.';
        this.load();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete slot.';
      }
    });
  }
}
