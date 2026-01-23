import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './login-navbar.component.html',
  styleUrls: ['./login-navbar.component.scss']
})
export class LoginNavbarComponent implements OnInit {
  isDarkMode: boolean = true;

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      this.isDarkMode = savedTheme === null || savedTheme === 'dark';
      if (savedTheme === null) {
        localStorage.setItem('theme', 'dark');
      }
      this.applyTheme();
    } else {
      this.applyTheme();
    }
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
}
