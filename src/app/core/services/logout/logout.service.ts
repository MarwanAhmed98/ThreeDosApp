import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class LogoutService {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) { }

    logout(): void {
        this.authService.Logout().subscribe({
            next: () => {
                this.toastr.success('Logged out successfully', 'ThreeDos');
                this.router.navigate(['/Login']);
            },
            error: () => {
                // Even if the API call fails, clear local data and redirect
                this.authService.forceLogout();
                this.toastr.info('Logged out locally', 'ThreeDos');
                this.router.navigate(['/Login']);
            }
        });
    }

    forceLogout(message?: string): void {
        // Clear user data and redirect without API call
        this.authService.forceLogout();
        if (message) {
            this.toastr.warning(message, 'Session Expired');
        }
        this.router.navigate(['/Login']);
    }
}