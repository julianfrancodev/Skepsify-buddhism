import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss'],
})
export class DashboardHeaderComponent implements OnInit {

  private authService = inject(AuthService);

  currentUser = computed(() => this.authService.currentUser()?.displayName || '');

  constructor() { }

  ngOnInit() { }

}
