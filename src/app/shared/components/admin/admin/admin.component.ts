import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;
  isDarkMode: boolean = localStorage.getItem('theme') === 'dark';
  currentTitle: string = 'Dashboard';
  UserName: string | null = localStorage.getItem('UserName');

  navItems = [
    { label: 'Dashboard', route: '/Admin/Dashboard', iconClass: 'fas fa-th-large' },
    { label: 'User Management', route: '/Admin/Users', iconClass: 'fas fa-users' },
    { label: 'Tasks', route: '/Admin/Tasks', iconClass: 'fas fa-tasks' },
    { label: 'Submissions', route: '/Admin/Submissions', iconClass: 'fas fa-file-upload' },
    { label: 'Attendance', route: '/Admin/Attendance', iconClass: 'fas fa-user-check' },
    { label: 'Teams', route: '/Admin/Teams', iconClass: 'fas fa-users-cog' },
    { label: 'Sessions', route: '/Admin/Sessions', iconClass: 'fas fa-calendar-alt' },
    { label: 'Councils', route: '/Admin/Councils', iconClass: 'fas fa-building' }
  ];

  ngOnInit(): void {
    this.applyTheme();
    this.updateTitleByRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitleByRoute();
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  updateTitleByRoute(): void {
    const currentRoute = this.router.url;
    const activeItem = this.navItems.find(item => currentRoute.includes(item.route));
    if (activeItem) {
      this.currentTitle = activeItem.label;
    }
  }

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
