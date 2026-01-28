import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { AuthService } from './core/services/auth/auth.service';
import { LogoutService } from './core/services/logout/logout.service';
import { initFlowbite } from 'flowbite/lib/esm/components';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ThreeDosApp';

  private flowbiteService = inject(FlowbiteService);
  private authService = inject(AuthService);
  private logoutService = inject(LogoutService);
  private tokenCheckInterval?: number;

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

    // Start periodic token expiration check
    this.startTokenExpirationCheck();
  }

  ngOnDestroy(): void {
    // Clear the interval when component is destroyed
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  private startTokenExpirationCheck(): void {
    // Check token expiration every 5 minutes
    this.tokenCheckInterval = window.setInterval(() => {
      if (this.authService.isAuthenticated() && this.authService.isTokenExpired()) {
        this.logoutService.forceLogout('Your session has expired. Please log in again.');
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Also check on user activity (with debouncing to prevent excessive checks)
    this.addActivityListeners();
  }

  private lastActivityCheck = 0;
  private activityCheckDebounce = 60000; // Check at most once per minute

  private addActivityListeners(): void {
    const events = ['mousedown', 'keypress', 'click'];

    const checkTokenExpiration = () => {
      const now = Date.now();
      // Only check if enough time has passed since last check
      if (now - this.lastActivityCheck > this.activityCheckDebounce) {
        this.lastActivityCheck = now;
        if (this.authService.isAuthenticated() && this.authService.isTokenExpired()) {
          this.logoutService.forceLogout('Your session has expired. Please log in again.');
        }
      }
    };

    events.forEach(event => {
      document.addEventListener(event, checkTokenExpiration, { passive: true });
    });
  }
}
