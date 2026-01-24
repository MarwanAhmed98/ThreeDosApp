import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delegates',
  imports: [CommonModule, RouterModule , RouterLink],
  templateUrl: './delegates.component.html',
  styleUrl: './delegates.component.scss'
})
export class DelegatesComponent {
  private readonly authService = inject(AuthService);
  private readonly toastrService = inject(ToastrService);
  private readonly router = inject(Router);

  isMobileMenuOpen = false;
  isDarkMode: boolean = localStorage.getItem('theme') === 'dark';
  currentTitle: string = 'Dashboard';
  UserName: string | null = localStorage.getItem('UserName');

  navItems = [
    { label: 'Dashboard', route: '/Delegates/DelegateDashboard', iconClass: 'fas fa-th-large' },
    { label: 'Sessions', route: '/Delegates/Delegatessession', iconClass: 'fas fa-calendar-alt' },
    { label: 'Attendance', route: '/Delegates/DelegateAttendance', iconClass: 'fas fa-user-check' },
    { label: 'Tasks', route: '/Delegates/Tasks', iconClass: 'fas fa-tasks' },
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
        this.toastrService.success('Logged out successfully', 'ThreeDos');
        this.router.navigate(['/Login']);
      },
      error: (err) => {
        // Even if API fails, the auth service clears local data
        this.toastrService.info('Logged out locally', 'ThreeDos');
        this.router.navigate(['/Login']);
      }
    });
  }
}
