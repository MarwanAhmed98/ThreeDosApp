import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { UsersService } from '../../../../core/services/users/users.service';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { TeamsService } from '../../../../core/services/teams/teams.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private usersService = inject(UsersService);
  private sessionsService = inject(SessionsService);
  private tasksService = inject(TasksService);
  private councilsService = inject(CouncilsService);
  private teamsService = inject(TeamsService);

  UserName: string = localStorage.getItem('UserName') || 'Admin';

  metrics: any[] = [];
  tasks: any[] = [];

  // raw service data
  sessionsData: any[] = [];
  tasksData: any[] = [];

  currentYear = new Date().getFullYear();
  currentMonthIndex = new Date().getMonth();

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: any[] = [];

  get currentMonthLabel(): string {
    return new Date(this.currentYear, this.currentMonthIndex)
      .toLocaleString('en-US', { month: 'long', year: 'numeric' });
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      users: this.usersService.GetUserList(1),
      sessions: this.sessionsService.GetSessionlList(1),
      tasks: this.tasksService.GetTaskList(1, 5),
      councils: this.councilsService.GetCouncilList(),
      teams: this.teamsService.GetTeamsList()
    }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.sessionsData = res.sessions.data.data || [];
        this.tasksData = res.tasks.data.data || [];

        this.metrics = [
          {
            label: 'Total Users',
            value: res.users.data.pagination?.total || res.users.data.data?.length || 0,
            trend: '+12%',
            trendColor: 'text-green-600',
            trendBg: 'bg-green-50',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
            iconClass: 'fas fa-user-friends'
          },
          {
            label: 'Active Sessions',
            value: this.sessionsData.length,
            trend: '+5%',
            trendColor: 'text-green-600',
            trendBg: 'bg-green-50',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50',
            iconClass: 'fas fa-bolt'
          },
          {
            label: 'Total Tasks',
            value: this.tasksData.length,
            trend: '-2%',
            trendColor: 'text-red-600',
            trendBg: 'bg-red-50',
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-50',
            iconClass: 'fas fa-tasks'
          },
          {
            label: 'Teams',
            value: res.teams.data?.length || 0,
            trend: '+3',
            trendColor: 'text-indigo-600',
            trendBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-50',
            iconClass: 'fas fa-users-cog'
          }
        ];

        this.tasks = this.tasksData.map((task: any) => ({
          title: task.title,
          user: task.council_name || 'No Group',
          status: task.status || 'Pending',
          statusColor: this.getStatusColor(task.status)
        }));

        this.generateCalendar();
      }
    });
  }

  generateCalendar(): void {
    const year = this.currentYear;
    const month = this.currentMonthIndex;
    const today = new Date();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const sessionDates = this.sessionsData.map(s =>
      this.formatDate(s.date)
    );

    const taskDates = this.tasksData.map(t =>
      this.formatDate(t.due_date || t.created_at)
    );

    const days: any[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({});
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = this.formatDate(new Date(year, month, d));

      days.push({
        date: dateStr,
        day: d,
        isToday:
          d === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
        hasSessions: sessionDates.includes(dateStr),
        hasTasks: taskDates.includes(dateStr)
      });
    }

    this.calendarDays = days;
  }

  prevMonth(): void {
    if (this.currentMonthIndex === 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else {
      this.currentMonthIndex--;
    }
    this.generateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonthIndex === 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    } else {
      this.currentMonthIndex++;
    }
    this.generateCalendar();
  }

  formatDate(date: any): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-600';
      case 'in progress': return 'bg-purple-50 text-purple-600';
      case 'pending': return 'bg-orange-50 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
