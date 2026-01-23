import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;
  currentTitle: string = 'Dashboard';
  UserName: string | null = localStorage.getItem('UserName');

  navItems = [
    { label: 'Dashboard', route: '/Admin/Dashboard', iconClass: 'fas fa-th-large' },
    { label: 'User Management', route: '/Admin/Users', iconClass: 'fas fa-users' },
    { label: 'Tasks', route: '/Admin/Tasks', iconClass: 'fas fa-tasks' },
    { label: 'Submissions', route: '/Admin/Submissions', iconClass: 'fas fa-file-upload' },
    { label: 'Sessions', route: '/Admin/Sessions', iconClass: 'fas fa-calendar-alt' },
    { label: 'Councils', route: '/Admin/Councils', iconClass: 'fas fa-building' }
  ];

  LogoutBtn(): void {
    this.authService.Logout().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'ThreeDos');
          localStorage.removeItem('userToken');
          localStorage.removeItem('UserName');
          setTimeout(() => {
            this.router.navigate(['/Login']);
          }, 1500);
        }
      }
    });
  }
}
