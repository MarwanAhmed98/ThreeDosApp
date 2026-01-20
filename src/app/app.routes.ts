import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login/login.component';
import { AdminComponent } from './shared/components/admin/admin/admin.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard/dashboard.component';
import { UsersComponent } from './shared/components/users/users/users.component';
import { TasksmangementComponent } from './shared/components/tasksmangement/tasksmangement/tasksmangement.component';
import { SessionsComponent } from './shared/components/sessions/sessions/sessions.component';
import { CouncilsComponent } from './shared/components/councils/councils/councils.component';
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
            { path: 'Dashboard', component: DashboardComponent , title: 'Dashboard' },
            { path: 'Councils', component: CouncilsComponent , title: 'Councils' },
            { path: 'Users', component: UsersComponent , title: 'User Management'},
            { path: 'Tasks', component: TasksmangementComponent , title: 'Task Management'},
            { path: 'Sessions', component: SessionsComponent , title: 'Sessions Management'},
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' }
        ]
    }
];
