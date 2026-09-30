import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './provider-dashboard.component.html'
})
export class ProviderDashboardComponent {
  constructor(public auth: AuthService) {}
}
