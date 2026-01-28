import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if user is authenticated
    if (authService.isAuthenticated()) {
        // Check if token is expired - if so, clear it and allow login
        if (authService.isTokenExpired()) {
            authService.clearUserData();
            return true; // Allow access to login page
        }

        // Token is valid, redirect to appropriate dashboard
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