import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastrService = inject(ToastrService);
  return next(req).pipe(catchError((err) => {
    toastrService.error(err.error.message, 'ThreeDos')
    return throwError(() => err)
  }));
  // const authService = inject(AuthService);
  // const router = inject(Router);

  // return next(req).pipe(
  //   catchError((err) => {
  //     // Handle 401 Unauthorized - Token expired or invalid
  //     if (err.status === 401) {
  //       // Only show session expired message if user was previously authenticated
  //       if (authService.isAuthenticated()) {
  //         toastrService.warning('Your session has expired. Please log in again.', 'Session Expired');
  //       }

  //       // Clear user data and redirect to login
  //       authService.forceLogout();
  //       router.navigate(['/login']);
  //       return throwError(() => err);
  //     }

  //     // Handle 403 Forbidden - Access denied
  //     if (err.status === 403) {
  //       toastrService.error('You do not have permission to perform this action.', 'Access Denied');
  //       return throwError(() => err);
  //     }

  //     // Handle 422 Validation errors
  //     if (err.status === 422) {
  //       const validationErrors = err.error?.errors;
  //       if (validationErrors) {
  //         // Show first validation error
  //         const firstError = Object.values(validationErrors)[0];
  //         const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
  //         toastrService.error(errorMessage as string, 'Validation Error');
  //       } else {
  //         const errorMessage = err.error?.message || 'Validation failed';
  //         toastrService.error(errorMessage, 'Validation Error');
  //       }
  //       return throwError(() => err);
  //     }

  //     // Handle 500 Server errors
  //     if (err.status >= 500) {
  //       toastrService.error('A server error occurred. Please try again later.', 'Server Error');
  //       return throwError(() => err);
  //     }

  //     // Handle network errors
  //     if (err.status === 0) {
  //       toastrService.error('Unable to connect to the server. Please check your internet connection.', 'Network Error');
  //       return throwError(() => err);
  //     }

  //     // Handle other errors
  //     const errorMessage = err.error?.message || 'An unexpected error occurred';
  //     toastrService.error(errorMessage, 'Error');

  //     return throwError(() => err);
  //   })
  // );
};
