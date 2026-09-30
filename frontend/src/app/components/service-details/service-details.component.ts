import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { AuthService } from '../../services/auth.service';
import { Service } from '../../models/models';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-details.component.html'
})
export class ServiceDetailsComponent implements OnInit {
  service: Service | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Invalid service.';
      this.loading = false;
      return;
    }

    this.serviceService.getServiceById(id).subscribe({
      next: (data) => {
        this.service = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load service.';
        this.loading = false;
      }
    });
  }

  providerName(): string {
    if (this.service && typeof this.service.providerId === 'object') {
      return this.service.providerId.name;
    }
    return 'Unknown Provider';
  }
}
