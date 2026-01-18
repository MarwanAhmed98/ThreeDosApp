import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login/login.component';
import { AdminComponent } from './shared/components/admin/admin/admin.component';
import { SeetingsComponent } from './shared/components/seetings/seetings/seetings.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard/dashboard.component';
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
            { path: 'Dashboard', component: DashboardComponent },
            { path: 'settings', component: SeetingsComponent },
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' }
        ]
    }
];
