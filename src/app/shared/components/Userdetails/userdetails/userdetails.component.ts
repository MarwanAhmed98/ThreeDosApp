import { Component, inject, OnInit } from '@angular/core';
import { AttendancesService } from '../../../../core/services/attendances/attendances.service';
import { ActivatedRoute } from '@angular/router';
import { IAttendance } from '../../../interfaces/iattendance';
import { IstudentAttendance } from '../../../interfaces/istudent-attendance';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { ISession } from '../../../interfaces/isession';
import { DatePipe } from '@angular/common';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { ITeam } from '../../../interfaces/iteams';

// Interfaces for type safety
interface ActivityStats {
  attendanceRate: number;
  attendanceTrend: number; // e.g., +4
  assignmentsSubmitted: number;
  assignmentsTotal: number;
  assignmentsPending: number;
  activeTeamsCount: number;
}

interface Session {
  id: number;
  date: Date;
  title: string;
  timeRange: string;
  location: string;
  status: 'Present' | 'Absent' | 'Excused';
}

interface Team {
  id: number;
  name: string;
  memberCount: number;
  initials: string;
  gradientFrom: string; // Tailwind color class
  gradientTo: string;   // Tailwind color class
}

interface Assignment {
  id: number;
  title: string;
  status: 'Submitted' | 'Pending' | 'Overdue';
  statusLabel: string; // e.g., "Submitted yesterday"
}

@Component({
  selector: 'app-userdetails',
  imports: [DatePipe],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.scss'
})
export class UserdetailsComponent implements OnInit {
  private readonly attendancesService = inject(AttendancesService);
  private readonly sessionsService = inject(SessionsService);
  private readonly teamsService = inject(TeamsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  currentPage: number = 1;
  UserId: string = '';
  AttendenceList: IstudentAttendance[] = [];
  SessionList: ISession[] = [];
  TeamList: ITeam[] = [];
  // 1. Summary Statistic
  stats: ActivityStats = {
    attendanceRate: 92,
    attendanceTrend: 4,
    assignmentsSubmitted: 12,
    assignmentsTotal: 15,
    assignmentsPending: 3,
    activeTeamsCount: 3
  };

  // 2. Attendance History Data
  sessions: Session[] = [
    {
      id: 1,
      date: new Date('2024-02-07'),
      title: 'Advanced Web Development',
      timeRange: '09:00 AM - 12:00 PM',
      location: 'Lab 3',
      status: 'Present'
    },
    {
      id: 2,
      date: new Date('2024-02-05'),
      title: 'Council Monthly Meeting',
      timeRange: '02:00 PM - 04:00 PM',
      location: 'Hall A',
      status: 'Absent'
    },
    {
      id: 3,
      date: new Date('2024-02-01'),
      title: 'UI/UX Workshop',
      timeRange: '10:00 AM - 11:30 AM',
      location: 'Online',
      status: 'Present'
    }
  ];

  // 3. Teams Data
  teams: Team[] = [
    {
      id: 1,
      name: 'Frontend Council',
      memberCount: 5,
      initials: 'FE',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-indigo-600'
    },
    {
      id: 2,
      name: 'Design Team A',
      memberCount: 3,
      initials: 'DE',
      gradientFrom: 'from-pink-500',
      gradientTo: 'to-rose-500'
    },
    {
      id: 3,
      name: 'Backend Squad',
      memberCount: 4,
      initials: 'BE',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500'
    }
  ];

  // 4. Assignments Data
  assignments: Assignment[] = [
    {
      id: 1,
      title: 'Angular Components',
      status: 'Submitted',
      statusLabel: 'Submitted yesterday'
    },
    {
      id: 2,
      title: 'Tailwind Grid Layout',
      status: 'Submitted',
      statusLabel: 'Submitted 2 days ago'
    },
    {
      id: 3,
      title: 'API Integration',
      status: 'Pending',
      statusLabel: 'Due in 2 days'
    }
  ];
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
  GetTeams(): void {
    this.teamsService.GetStudentTeams(this.UserId).subscribe({
      next: (res) => {
        console.log(res.data, 'Teams Data');
        this.TeamList = res.data;
      }
    })
  }
  get assignmentCompletionPercentage(): number {
    if (this.stats.assignmentsTotal === 0) return 0;
    return Math.round((this.stats.assignmentsSubmitted / this.stats.assignmentsTotal) * 100);
  }
}
