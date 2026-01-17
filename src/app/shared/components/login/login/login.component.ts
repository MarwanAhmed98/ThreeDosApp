import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService)
  private readonly toastrService = inject(ToastrService)
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
          }
          this.isLoading = false;
        },

      })
    }
  }
}
