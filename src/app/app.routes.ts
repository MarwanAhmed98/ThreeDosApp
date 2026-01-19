import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login/login.component';
import { AdminComponent } from './shared/components/admin/admin/admin.component';
import { SeetingsComponent } from './shared/components/seetings/seetings/seetings.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard/dashboard.component';
import { UsersComponent } from './shared/components/users/users/users.component';
import { TasksmangementComponent } from './shared/components/tasksmangement/tasksmangement/tasksmangement.component';
import { SessionsComponent } from './shared/components/sessions/sessions/sessions.component';
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
            { path: 'settings', component: SeetingsComponent , title: 'Settings' },
            { path: 'Users', component: UsersComponent , title: 'User Management'},
            { path: 'Tasks', component: TasksmangementComponent , title: 'Task Management'},
            { path: 'Sessions', component: SessionsComponent , title: 'Sessions Management'},
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' }
        ]
    }
];
