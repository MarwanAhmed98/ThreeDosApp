import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AttendancesService } from '../../../../core/services/attendances/attendances.service';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { SearchattendancePipe } from '../../../pipes/searchattendance/searchattendance.pipe';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SearchattendancePipe],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent implements OnInit {
  private readonly attendanceService = inject(AttendancesService);
  private readonly sessionsService = inject(SessionsService);
  private readonly usersService = inject(UsersService);

  AttendanceList: any[] = [];
  SessionList: any[] = [];
  UserList: any[] = [];
  text: string = '';
  currentPage: number = 1;
  lastPage: number = 1;

  // Modal State
  isModalOpen: boolean = false;
  isBulkModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedAttendanceId: string | null = null;
  selectedBulkFile: File | null = null;

  // Form Data
  attendanceData = {
    user_id: '',
    council_session_id: '',
    status: 'present'
  };

  ngOnInit(): void {
    this.GetAttendances();
    this.GetSessions();
    this.GetUsers();
  }

  GetAttendances(): void {
    this.attendanceService.GetAttendanceList(this.currentPage).subscribe({
      next: (res) => {
        this.AttendanceList = res.data.data;
        this.lastPage = res.data.pagination.last_page;
      }
    });
  }

  GetSessions(): void {
    this.sessionsService.GetSessionlList(1).subscribe({
      next: (res) => {
        this.SessionList = res.data.data;
      }
    });
  }

  GetUsers(): void {
    this.usersService.GetUserList(1).subscribe({
      next: (res) => {
        this.UserList = res.data.data;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.GetAttendances();
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedAttendanceId = null;
    this.attendanceData = { user_id: '', council_session_id: '', status: 'present' };
    this.isModalOpen = true;
  }

  openBulkModal(): void {
    this.selectedBulkFile = null;
    this.isBulkModalOpen = true;
  }

  onBulkFileSelected(event: any): void {
    this.selectedBulkFile = event.target.files[0];
  }

  onBulkSubmit(): void {
    if (this.selectedBulkFile) {
      this.attendanceService.BulkCreateAttendance(this.selectedBulkFile).subscribe({
        next: () => {
          this.GetAttendances();
          this.closeBulkModal();
        }
      });
    }
  }

  closeBulkModal(): void {
    this.isBulkModalOpen = false;
    this.selectedBulkFile = null;
  }

  openEditModal(attendance: any): void {
    this.isEditMode = true;
    this.selectedAttendanceId = attendance.id;
    // Assuming attendance object from list has user_id and council_session_id
    // But based on user description, it has 'student' and 'session' names.
    // I may need to find the IDs or the API might return them in a full object.
    this.attendanceData = {
      user_id: attendance.student_id || '',
      council_session_id: attendance.session_id || '',
   
      status: attendance.status
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedAttendanceId) {
      this.attendanceService.UpdateAttendance(this.selectedAttendanceId, this.attendanceData).subscribe({
        next: () => {
          this.GetAttendances();
          this.closeModal();
        }
      });
    } else {
      this.attendanceService.AddAttendance(this.attendanceData).subscribe({
        next: () => {
          this.GetAttendances();
          this.closeModal();
        }
      });
    }
  }

  deleteAttendance(id: string): void {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.attendanceService.DeleteAttendance(id).subscribe({
        next: () => {
          this.GetAttendances();
        }
      });
    }
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-green-50 text-green-600';
      case 'absent': return 'bg-red-50 text-red-600';
      case 'late': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-50';
    }
  }
}
