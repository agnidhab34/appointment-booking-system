import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceService } from '../../services/service.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/models';

@Component({
  selector: 'app-manage-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-services.component.html'
})
export class ManageServicesComponent implements OnInit {
  private fb = inject(FormBuilder);

  services: Service[] = [];
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';
  editingId: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: [''],
    duration: [30, [Validators.required, Validators.min(5)]],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private serviceService: ServiceService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const providerId = this.auth.currentUser()?.id;
    this.serviceService.getServices(providerId).subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load services.';
        this.loading = false;
      }
    });
  }

  startEdit(service: Service): void {
    this.editingId = service._id;
    this.form.setValue({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form.reset({ name: '', description: '', duration: 30, price: 0 });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';
    const payload = this.form.getRawValue();

    const request = this.editingId
      ? this.serviceService.updateService(this.editingId, payload)
      : this.serviceService.createService(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = this.editingId ? 'Service updated.' : 'Service created.';
        this.cancelEdit();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err.error?.message || 'Failed to save service.';
      }
    });
  }

  delete(service: Service): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.serviceService.deleteService(service._id).subscribe({
      next: () => {
        this.successMessage = 'Service deleted.';
        this.load();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to delete service.';
      }
    });
  }
}
