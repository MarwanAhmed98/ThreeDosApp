import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login/login.component';
import { AdminComponent } from './shared/components/admin/admin/admin.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard/dashboard.component';
import { UsersComponent } from './shared/components/users/users/users.component';
import { TasksmangementComponent } from './shared/components/tasksmangement/tasksmangement/tasksmangement.component';
import { SessionsComponent } from './shared/components/sessions/sessions/sessions.component';
import { CouncilsComponent } from './shared/components/councils/councils/councils.component';
import { TaskSubmissionsComponent } from './shared/components/task-submissions/task-submissions/task-submissions.component';
import { AttendanceComponent } from './shared/components/attendance/attendance/attendance.component';
import { TeamsComponent } from './shared/components/teams/teams/teams.component';
import { DelegatesComponent } from './shared/components/delegates/delegates/delegates.component';
import { DelegatesdashboardComponent } from './shared/components/delegatesdashboard/delegatesdashboard/delegatesdashboard.component';
import { DelegatessessionComponent } from './shared/components/delegatessession/delegatessession/delegatessession.component';
import { DelegatesattendanceComponent } from './shared/components/delegatesattendance/delegatesattendance/delegatesattendance.component';
export const routes: Routes = [
    {
        path: '', redirectTo: 'Login', pathMatch: 'full'
    },
    {
        path: 'Login', component: LoginComponent, title: 'Login'
    },
    {
        path: 'Admin',
        component: AdminComponent,
        children: [
            { path: 'Dashboard', component: DashboardComponent, title: 'Dashboard' },
            { path: 'Councils', component: CouncilsComponent, title: 'Councils' },
            { path: 'Users', component: UsersComponent, title: 'User Management' },
            { path: 'Tasks', component: TasksmangementComponent, title: 'Task Management' },
            { path: 'Sessions', component: SessionsComponent, title: 'Sessions Management' },
            { path: 'Submissions', component: TaskSubmissionsComponent, title: 'Task Submissions' },
            { path: 'Submissions/:taskId', component: TaskSubmissionsComponent, title: 'Task Submissions' },
            { path: 'Attendance', component: AttendanceComponent, title: 'Attendance Management' },
            { path: 'Teams', component: TeamsComponent, title: 'Team Management' },
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'Delegates',
        component: DelegatesComponent,
        children: [
            { path: 'DelegateDashboard', component: DelegatesdashboardComponent, title: 'Dashboard' },
            { path: 'Tasks', component: TasksmangementComponent, title: 'Task Management' },
            { path: 'Delegatessession', component: DelegatessessionComponent, title: 'Sessions' },
            { path: 'Submissions', component: TaskSubmissionsComponent, title: 'Task Submissions' },
            { path: 'Submissions/:taskId', component: TaskSubmissionsComponent, title: 'Task Submissions' },
            { path: 'DelegateAttendance', component: DelegatesattendanceComponent, title: 'Attendance' },
            { path: '', redirectTo: 'DelegateDashboard', pathMatch: 'full' }
        ]
    }
];
