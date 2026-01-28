import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
        router.navigate(['/Login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // Check if token is expired
    if (authService.isTokenExpired()) {
        toastr.warning('Your session has expired. Please log in again.', 'Session Expired');
        authService.clearUserData();
        router.navigate(['/Login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    return true;
};