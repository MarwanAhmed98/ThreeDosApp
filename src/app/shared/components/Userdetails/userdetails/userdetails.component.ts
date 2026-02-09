import { IUserDashboardDetails } from './../../../interfaces/iuser-dashboard-details';
import { Component, inject, OnInit } from '@angular/core';
import { AttendancesService } from '../../../../core/services/attendances/attendances.service';
import { ActivatedRoute } from '@angular/router';
import { IstudentAttendance } from '../../../interfaces/istudent-attendance';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { ISession } from '../../../interfaces/isession';
import { CommonModule, DatePipe } from '@angular/common';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { ITeam } from '../../../interfaces/iteams';
import { TaskSubmissionsService } from '../../../../core/services/task-submissions/task-submissions.service';
import { IUserAssignments } from '../../../interfaces/iuser-assignments';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'app-userdetails',
  imports: [DatePipe, CommonModule],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.scss'
})
export class UserdetailsComponent implements OnInit {
  private readonly attendancesService = inject(AttendancesService);
  private readonly sessionsService = inject(SessionsService);
  private readonly teamsService = inject(TeamsService);
  private readonly taskSubmissionsService = inject(TaskSubmissionsService);
  private readonly usersService = inject(UsersService);
  private readonly activatedRoute = inject(ActivatedRoute);
  currentPage: number = 1;
  lastPage: number = 1;
  Total: number = 0;
  currentPageAttendance: number = 1;
  lastPageAttendance: number = 1;
  TotalAttendance: number = 0;
  UserId: string = '';
  AttendenceList: IstudentAttendance[] = [];
  SessionList: ISession[] = [];
  TeamList: ITeam[] = [];
  AssignmentsList: IUserAssignments[] = [];
  UserDashboardDetails = {} as IUserDashboardDetails;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        console.log(params.get('userId'));
        this.UserId = params.get('userId') || '';
      }
    })
    this.GetUserAttendanceSessions();
    this.GetSessions();
    this.GetTeams();
    this.GetAssignments();
    this.GetUserDashboard();
  }
  GetUserAttendanceSessions() {
    this.attendancesService.GetUserAttendance(this.currentPage, 4, this.UserId).subscribe({
      next: (res) => {
        console.log(res.data.data);
        this.AttendenceList = res.data.data;
        if(res.data.pagination) {
          this.lastPage = res.data.pagination.last_page;
          this.Total = res.data.pagination.total;
        }
      }
    })
  }
  GetSessions(): void {
    this.sessionsService.GetSessionlList(this.currentPage).subscribe({
      next: (res) => {
        console.log(res, 'sessions');
        console.log(res.data.data);
        this.SessionList = res.data.data;
        if(!this.lastPage) {
           this.lastPage = res.data.pagination.last_page;
           this.Total = res.data.pagination.total;
        }
      }
    })
  }
  GetAssignments(): void {
    this.taskSubmissionsService.GetAssignmentsByUserId(this.UserId, this.currentPageAttendance).subscribe({
      next: (res) => {
        this.AssignmentsList = res.data.data;
        this.lastPageAttendance = res.data.pagination.last_page;
        this.TotalAttendance = res.data.pagination.total;
      }
    })
  }
  GetTeams(): void {
    this.teamsService.GetStudentTeams(this.UserId).subscribe({
      next: (res) => {
        console.log(res.data, 'Teams Data');
        this.TeamList = res.data;
      }
    })
  }
  GetUserDashboard(): void {
    this.usersService.GetUserDetailsById(this.UserId).subscribe({
      next: (res) => {
        this.UserDashboardDetails = res.data;
        console.log(this.UserDashboardDetails);
      }
    })
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPageAttendance) {
      this.currentPageAttendance = page;
      this.GetAssignments();
    }
  }
  changePageSessions(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.GetUserAttendanceSessions();
    }
  }
}