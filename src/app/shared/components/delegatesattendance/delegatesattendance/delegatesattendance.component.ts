import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users/users.service';
import { IUserDahboard } from '../../../interfaces/iuser-dahboard';
@Component({
  selector: 'app-delegatesattendance',
  imports: [CommonModule, FormsModule],
  templateUrl: './delegatesattendance.component.html',
  styleUrl: './delegatesattendance.component.scss'
})
export class DelegatesattendanceComponent implements OnInit {
  private readonly usersService = inject(UsersService)
  UserDashboardList: IUserDahboard = {} as IUserDahboard;
  text = '';
  currentPage = 1;
  lastPage = 1;
  // Personal Attendance Records
  attendanceRecords = signal([
    { id: 1, session: 'Intro to Angular 19', date: new Date('2024-01-20'), status: 'present' },
    { id: 2, session: 'UI/UX Design Systems', date: new Date('2024-01-18'), status: 'late' },
    { id: 3, session: 'State Management Workshop', date: new Date('2024-01-15'), status: 'absent' },
    { id: 4, session: 'Git & GitHub Advanced', date: new Date('2024-01-10'), status: 'present' },
    { id: 5, session: 'Tailwind CSS Mastery', date: new Date('2024-01-05'), status: 'present' },
  ]);

  // Computed stats for the summary cards
  totalSessions = computed(() => this.attendanceRecords().length);
  presentCount = computed(() => this.attendanceRecords().filter(r => r.status === 'present' || r.status === 'late').length);
  attendancePercentage = computed(() => Math.round((this.presentCount() / this.totalSessions()) * 100));

  ngOnInit(): void {
    this.GetDashboardData();
  }
  getStatusClass(status: string) {
    switch (status) {
      case 'present': return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20';
      case 'absent': return 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20';
      case 'late': return 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20';
      default: return 'bg-slate-50 text-slate-600';
    }
  }

  changePage(page: number) {
    this.currentPage = page;
  }
  GetDashboardData(): void {
    this.usersService.GetUserDasgboard().subscribe({
      next: (res) => {
        this.UserDashboardList = res.data;
        console.log(this.UserDashboardList);

      }
    })
  }
}