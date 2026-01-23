import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // If user is already authenticated, redirect to appropriate dashboard
    if (authService.isAuthenticated()) {
        if (authService.isAdmin()) {
            router.navigate(['/Admin']);
        } else {
            router.navigate(['/Delegates']);
        }
        return false;
    }

    // Allow access to login page if not authenticated
    return true;
};