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
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
  private readonly router = inject(Router)
  isMobileMenuOpen = false;
  navItems = [
    { label: 'Dashboard', route: '/Admin/Dashboard', iconClass: 'fas fa-th-large' },
    { label: 'Analytics', route: '/Admin/analytics', iconClass: 'fas fa-chart-line' },
    { label: 'Team', route: '/Admin/team', iconClass: 'fas fa-users' },
    { label: 'Projects', route: '/Admin/projects', iconClass: 'fas fa-folder' },
    { label: 'Settings', route: '/Admin/settings', iconClass: 'fas fa-cog' }
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
          }, 1500)
        }
        console.log(res);
      }
    })
  }

}
