import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users/users.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { Iusers } from '../../../interfaces/iusers';
import { Icouncils } from '../../../interfaces/icouncils';
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
  UsersList: Iusers[] = [];
  CouncilList: Icouncils[] = [];
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
    role: 'User',
    council: '',
    status: 'Active'
  };
  ngOnInit(): void {
    this.GetUsers();
    this.GetCouncils();
  }
  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data;
      }
    });
  }
  GetUsers(): void {
    this.usersService.GetUserList(this.currentPage).subscribe({
      next: (res) => {
        this.UsersList = res.data.data;
        this.totalPages = res.data.last_page;
        this.currentPage = res.data.current_page;
        console.log(this.UsersList);
      }
    })
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
    this.userData = { name: '', email: '', role: 'Delegate', council: '', status: 'Active' };
    this.isModalOpen = true;
  }

  openEditModal(user: Iusers): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userData = {
      name: user.name,
      email: user.email,
      role: user.role,
      council: user.council,
      status: user.status
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedUserId) {
      this.usersService.UpdateUser({ ...this.userData, id: this.selectedUserId }).subscribe({
        next: () => {
          this.GetUsers();
          this.closeModal();
        }
      });
    } else {
      this.usersService.AddUser(this.userData).subscribe({
        next: () => {
          this.GetUsers();
          this.closeModal();
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.DeleteUser(id).subscribe({
        next: () => {
          this.GetUsers();
        }
      });
    }
  }
}
