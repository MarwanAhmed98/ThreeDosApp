import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UsersService } from '../../../../core/services/users/users.service';
import { IUserDahboard } from '../../../interfaces/iuser-dahboard';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delegatesdashboard',
  imports: [CommonModule , RouterLink , DatePipe ],
  templateUrl: './delegatesdashboard.component.html',
  styleUrl: './delegatesdashboard.component.scss'
})
export class DelegatesdashboardComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly sessionsService = inject(SessionsService);
  private readonly tasksService = inject(TasksService);
  private readonly councilsService = inject(CouncilsService);
  private readonly teamsService = inject(TeamsService);

  UserDashboardList: IUserDahboard = {} as IUserDahboard;
  UserName: string = localStorage.getItem('UserName') || 'Admin';
  metrics: any[] = [];
  tasks: any[] = [];

  ngOnInit(): void {
    this.GetDashboardData();
    this.LoadDashboardData();
  }

  GetDashboardData(): void {
    this.usersService.GetUserDasgboard().subscribe({
      next: (res) => {
        console.log(res);
        this.UserDashboardList = res.data;
        console.log(this.UserDashboardList);
      },
      error: (err) => {
        console.error('Error fetching user dashboard:', err);
      },
    });
  }

  LoadDashboardData(): void {
    forkJoin({
      users: this.usersService.GetUserList(1),
      sessions: this.sessionsService.GetSessionlList(1),
      tasks: this.tasksService.GetTaskList(1, 5), // Ensure this call works correctly
      councils: this.councilsService.GetCouncilList(),
      teams: this.teamsService.GetTeamsList(),
    }).subscribe({
      next: (res: any) => {
        // Map metrics
        this.metrics = [
          {
            label: 'Total Users',
            value: res.users.data.pagination?.total || res.users.data.data?.length || 0,
            trend: '+12%',
            trendColor: 'text-green-600',
            trendBg: 'bg-green-50',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50',
            iconClass: 'fas fa-user-friends',
          },
          {
            label: 'Active Sessions',
            value: res.sessions.data.pagination?.total || res.sessions.data.data?.length || 0,
            trend: '+5%',
            trendColor: 'text-green-600',
            trendBg: 'bg-green-50',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-50',
            iconClass: 'fas fa-bolt',
          },
          {
            label: 'Total Tasks',
            value: res.tasks.data.pagination?.total || res.tasks.data.data?.length || 0,
            trend: '-2%',
            trendColor: 'text-red-600',
            trendBg: 'bg-red-50',
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-50',
            iconClass: 'fas fa-tasks',
          },
          {
            label: 'Teams',
            value: res.teams.data?.length || 0,
            trend: '+3',
            trendColor: 'text-indigo-600',
            trendBg: 'bg-indigo-50',
            iconColor: 'text-indigo-600',
            iconBg: 'bg-indigo-50',
            iconClass: 'fas fa-users-cog',
          },
        ];

        // Map tasks
        this.tasks = (res.tasks.data.data || []).map((task: any) => ({
          title: task.title,
          group: task.council_name || task.council_session || 'No Group',
          status: task.status || 'Pending',
          statusColor: this.getStatusColor(task.status),
        }));
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-50 text-green-600';
      case 'in progress':
        return 'bg-purple-50 text-purple-600';
      case 'pending':
        return 'bg-orange-50 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
