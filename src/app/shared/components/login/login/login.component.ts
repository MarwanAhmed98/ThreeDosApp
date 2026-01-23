import { Component, inject } from '@angular/core';
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
export class LoginComponent {
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
  private readonly router = inject(Router)
  isLoading: boolean = false;
  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.pattern('^[A-Za-z0-9]{3,8}$')])
  });
  LoginFormSubmit(): void {
    if (this.LoginForm.valid) {
      this.isLoading = true;
      this.authService.SendLoginForm(this.LoginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.toastrService.success(res.message, 'ThreeDos')
            localStorage.setItem('userToken', res.data.access_token);
            localStorage.setItem('UserName', res.data.user_name);
            localStorage.setItem('userRole', res.data.role);
            this.router.navigate([res.data.role === 'Head'||res.data.role === 'Instructor' ||res.data.role === 'VicePresident' ? '/Admin' : '/User']);
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        }
      })
    }
  }
}
