import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  // Using signals for reactive state management (optional, but modern Angular)
  // or standard properties for simplicity with the provided HTML

  userProfile: UserProfile = {
    name: '',
    email: '',
    role: '',
    bio: '',
    avatarUrl: ''
  };

  isLoading = false;
  isSaving = false;

  constructor() { }

  ngOnInit(): void {
    this.loadProfile();
  }

  /**
   * Simulates fetching user data from an API
   */
  loadProfile() {
    this.isLoading = true;

    // Simulate API delay
    setTimeout(() => {
      this.userProfile = {
        name: 'Marwan Ahmed',
        email: 'marwan.ahmed98@example.com',
        role: 'Backend Development Council',
        bio: 'Passionate about building scalable APIs and cloud architecture. Always learning new technologies.',
        avatarUrl: '' // The HTML handles the avatar generation via UI Avatars API based on the name
      };
      this.isLoading = false;
    }, 500);
  }

  /**
   * Handles form submission
   */
  saveProfile() {
    this.isSaving = true;

    // Simulate API call to save data
    setTimeout(() => {
      console.log('Profile Saved:', this.userProfile);

      // You would typically show a toast notification here
      // e.g., this.toastService.success('Profile updated successfully!');

      this.isSaving = false;
      alert('Changes saved successfully!'); // Simple feedback for now
    }, 1000);
  }

  /**
   * Placeholder for file upload logic
   */
  onUploadPhoto() {
    // Logic to open file selector and upload image would go here
    console.log('Open file dialog');
  }

  /**
   * Placeholder for removing photo
   */
  onRemovePhoto() {
    // Logic to revert to default avatar or delete custom image
    console.log('Remove photo');
  }

}