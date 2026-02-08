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
  private readonly activatedRoute = inject(ActivatedRoute);
  currentPage: number = 1;
  UserId: string = '';
  AttendenceList: IstudentAttendance[] = [];
  SessionList: ISession[] = [];
  TeamList: ITeam[] = [];
  AssignmentsList: IUserAssignments[] = [];
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
  }
  GetUserAttendanceSessions() {
    this.attendancesService.GetUserAttendance(this.currentPage, 10, this.UserId).subscribe({
      next: (res) => {
        console.log(res.data.data);
        this.AttendenceList = res.data.data;
      }
    })
  }
  GetSessions(): void {
    this.sessionsService.GetSessionlList(this.currentPage).subscribe({
      next: (res) => {
        console.log(res.data.data);
        this.SessionList = res.data.data;
      }
    })
  }
  GetAssignments(): void {
    this.taskSubmissionsService.GetAssignmentsByUserId(this.UserId).subscribe({
      next: (res) => {
        console.log(res.data.data, 'Assignments Data');
        this.AssignmentsList = res.data.data;
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
}
