import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users/users.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { RolesService } from '../../../../core/services/roles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { Iusers } from '../../../interfaces/iusers';
import { Icouncils } from '../../../interfaces/icouncils';
import { IRole } from '../../../interfaces/iroles';
import { SearchuserPipe } from '../../../pipes/searchuser/searchuser.pipe';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, SearchuserPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly councilsService = inject(CouncilsService);
  private readonly rolesService = inject(RolesService);
  private readonly toastr = inject(ToastrService);

  UsersList: Iusers[] = [];
  CouncilList: Icouncils[] = [];
  RolesList: IRole[] = [];
  text: string = "";
  currentPage: number = 1;
  totalPages: number = 1;

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: string | null = null;

  // Form Data
  userData = {
    name: '',
    email: '',
    password: '',
    role_id: '',
    council_id: '',
    status: 'Active'
  };

  ngOnInit(): void {
    this.GetUsers();
    this.GetCouncils();
    this.GetRoles();
  }

  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data;
      },
      error: () => {
        this.toastr.error('Failed to load councils', 'Error');
      }
    });
  }

  GetRoles(): void {
    this.rolesService.GetRolesList().subscribe({
      next: (res) => {
        this.RolesList = res.data || res; // Handle different response formats
      },
      error: () => {
        this.toastr.error('Failed to load roles', 'Error');
      }
    });
  }

  GetUsers(): void {
    this.usersService.GetUserList(this.currentPage).subscribe({
      next: (res) => {
        this.UsersList = res.data.data;
        this.totalPages = res.data.last_page;
        this.currentPage = res.data.current_page;
      },
      error: () => {
        this.toastr.error('Failed to load users', 'Error');
      }
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.GetUsers();
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userData = {
      name: '',
      email: '',
      password: '',
      role_id: '',
      council_id: '',
      status: 'Active'
    };
    this.isModalOpen = true;
  }

  openEditModal(user: Iusers): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;

    // Find the role_id and council_id based on names
    const role = this.RolesList.find(r => r.name === user.role);
    const council = this.CouncilList.find(c => c.name === user.council);

    this.userData = {
      name: user.name,
      email: user.email,
      password: '', // Don't pre-fill password for security
      role_id: role?.id || '',
      council_id: council?.id || '',
      status: user.status
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    // Validate required fields
    if (!this.userData.name || !this.userData.email || !this.userData.role_id || !this.userData.council_id) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    if (!this.isEditMode && !this.userData.password) {
      this.toastr.error('Password is required for new users', 'Validation Error');
      return;
    }

    const submitData = { ...this.userData };

    // Remove password from update if it's empty (for edit mode)
    if (this.isEditMode && !submitData.password) {
      delete (submitData as any).password;
    }

    if (this.isEditMode && this.selectedUserId) {
      this.usersService.UpdateUser({ ...submitData, id: this.selectedUserId }).subscribe({
        next: () => {
          this.toastr.success('User updated successfully', 'Success');
          this.GetUsers();
          this.closeModal();
        },
        error: (error) => {
          let errorMessage = 'Failed to update user';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = validationErrors.join(', ');
          }
          this.toastr.error(errorMessage, 'Update Error');
        }
      });
    } else {
      this.usersService.AddUser(submitData).subscribe({
        next: () => {
          this.toastr.success('User created successfully', 'Success');
          this.GetUsers();
          this.closeModal();
        },
        error: (error) => {
          let errorMessage = 'Failed to create user';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error.errors) {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = validationErrors.join(', ');
          }
          this.toastr.error(errorMessage, 'Creation Error');
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.DeleteUser(id).subscribe({
        next: () => {
          this.toastr.success('User deleted successfully', 'Success');
          this.GetUsers();
        },
        error: () => {
          this.toastr.error('Failed to delete user', 'Error');
        }
      });
    }
  }

  // Helper methods to get display names
  getRoleName(roleId: string): string {
    const role = this.RolesList.find(r => r.id === roleId);
    return role?.name || 'Unknown';
  }

  getCouncilName(councilId: string): string {
    const council = this.CouncilList.find(c => c.id === councilId);
    return council?.name || 'Unknown';
  }
}
