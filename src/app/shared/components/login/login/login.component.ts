import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LoginNavbarComponent } from '../../login-navbar/login-navbar.component';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoginNavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
  private readonly router = inject(Router)
  isLoading: boolean = false;
  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern('^[A-Za-z0-9]{3,8}$')]),
    rememberMe: new FormControl(false)
  });

  ngOnInit(): void {
    this.loadRememberedCredentials();
  }

  loadRememberedCredentials(): void {
    if (typeof localStorage !== 'undefined') {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      const rememberedPassword = localStorage.getItem('rememberedPassword');
      const rememberMe = localStorage.getItem('rememberMe') === 'true';

      if (rememberMe && rememberedEmail && rememberedPassword) {
        this.LoginForm.patchValue({
          email: rememberedEmail,
          password: rememberedPassword,
          rememberMe: true
        });
      }
    }
  }
  LoginFormSubmit(): void {
    if (this.LoginForm.valid) {
      this.isLoading = true;

      this.handleRememberMe();

      this.authService.SendLoginForm(this.LoginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'ThreeDos')
            localStorage.setItem('userToken', res.data.access_token);
            localStorage.setItem('UserName', res.data.user_name);
            localStorage.setItem('UserRole', res.data.role);
            if (res.data.role === 'Head' || res.data.role === 'Instructor' || res.data.role === 'VicePresident') {
              this.router.navigate(['/Admin']);
            }
            else {
              this.router.navigate(['/Delegates']);
            }
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
    }
  }

  handleRememberMe(): void {
    if (typeof localStorage !== 'undefined') {
      const rememberMe = this.LoginForm.get('rememberMe')?.value;

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', this.LoginForm.get('email')?.value);
        localStorage.setItem('rememberedPassword', this.LoginForm.get('password')?.value);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }
    }
  }
}
