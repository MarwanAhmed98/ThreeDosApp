import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const delegateGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if user is authenticated
    if (!authService.isAuthenticated()) {
        router.navigate(['/Login']);
        return false;
    }

    // Check if token is expired
    if (authService.isTokenExpired()) {
        authService.clearUserData();
        router.navigate(['/Login']);
        return false;
    }

    // Check if user has delegate role (not admin)
    if (authService.isDelegate()) {
        return true;
    }

    // If user is authenticated but is admin, redirect to admin dashboard
    router.navigate(['/Admin']);
    return false;
};