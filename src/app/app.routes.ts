import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login/login.component';
export const routes: Routes = [
    {
        path: '', redirectTo: 'Login', pathMatch: 'full'
    },
    {
        path: 'Login', component: LoginComponent, title: 'Login'
    },
];
