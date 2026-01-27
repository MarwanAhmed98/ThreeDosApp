import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { IUserProfile } from '../../../interfaces/iuser-profile';
// Interface for type safety
interface UserProfile {
  name: string;
  email: string;
  role: string;
  bio: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-studentsprofile',
  imports: [CommonModule, FormsModule],
  templateUrl: './studentsprofile.component.html',
  styleUrl: './studentsprofile.component.scss'
})
export class StudentsprofileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  UserProfileList: IUserProfile = {} as IUserProfile;
  constructor() { }

  ngOnInit(): void {
    this.GetProfile();
  }

  GetProfile(): void {
    this.authService.GetMe().subscribe({
      next: (res) => {
        this.UserProfileList = res.data;
        console.log('User Profile Data:', this.UserProfileList);

      }
    })
  }
}