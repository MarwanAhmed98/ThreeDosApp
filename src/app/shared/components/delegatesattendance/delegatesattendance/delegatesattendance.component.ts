import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users/users.service';
import { IUserDahboard } from '../../../interfaces/iuser-dahboard';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { AttendancesService } from '../../../../core/services/attendances/attendances.service';
import { IstudentAttendance } from '../../../interfaces/istudent-attendance';
@Component({
  selector: 'app-delegatesattendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './delegatesattendance.component.html',
  styleUrl: './delegatesattendance.component.scss'
})
export class DelegatesattendanceComponent implements OnInit {
  private readonly usersService = inject(UsersService)
  private readonly authService = inject(AuthService)
  private readonly attendancesService = inject(AttendancesService)
  UserDashboardList: IUserDahboard = {} as IUserDahboard;
  UserAttendanceList: IstudentAttendance[] = []
  text = '';
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;

  ngOnInit(): void {
    this.authService.GetMe().subscribe({
      next: () => {
        this.GetDashboardData();
        this.GetStudentAttendanceRecords();
      }
    });
  }
  getStatusClass(status: string) {
    switch (status) {
      case 'present': return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20';
      case 'absent': return 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20';
      case 'late': return 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20';
      default: return 'bg-slate-50 text-slate-600';
    }
  }
  GetDashboardData(): void {
    this.usersService.GetUserDasgboard().subscribe({
      next: (res) => {
        this.UserDashboardList = res.data;
        console.log(this.UserDashboardList);

      }
    })
  }
  GetStudentAttendanceRecords(): void {
    this.attendancesService.GetUserAttendance(this.currentPage, 10, this.authService.StudentId).subscribe({
      next: (res) => {
        this.UserAttendanceList = res.data.data;
        console.log(this.UserAttendanceList);
        console.log(this.authService.StudentId);
      }
    })
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.lastpage) {
      this.currentPage = page;
      this.GetStudentAttendanceRecords();
    }
  }
}