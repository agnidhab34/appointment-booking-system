import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/models';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services-list.component.html'
})
export class ServicesListComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  errorMessage = '';

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getServices().subscribe({
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

  providerName(service: Service): string {
    if (typeof service.providerId === 'object' && service.providerId !== null) {
      return service.providerId.name;
    }
    return 'Unknown Provider';
  }
}
