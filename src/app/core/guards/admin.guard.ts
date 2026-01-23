import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // First check if user is authenticated
    if (!authService.isAuthenticated()) {
        router.navigate(['/Login']);
        return false;
    }

    // Check if user has admin role
    if (authService.isAdmin()) {
        return true;
    }

    // If user is authenticated but not admin, redirect to delegates dashboard
    router.navigate(['/Delegates']);
    return false;
};