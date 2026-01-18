import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  UserName: string = localStorage.getItem('UserName') || 'Admin';
  
  isMobileMenuOpen = false;
  metrics = [
    { label: 'Total Users', value: '1,240', trend: '+12%', trendColor: 'text-green-600', trendBg: 'bg-green-50', iconColor: 'text-blue-600', iconBg: 'bg-blue-50', iconClass: 'fas fa-user-friends' },
    { label: 'Active Sessions', value: '84', trend: '+5%', trendColor: 'text-green-600', trendBg: 'bg-green-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-50', iconClass: 'fas fa-bolt' },
    { label: 'Pending Tasks', value: '12', trend: '-2%', trendColor: 'text-red-600', trendBg: 'bg-red-50', iconColor: 'text-orange-600', iconBg: 'bg-orange-50', iconClass: 'fas fa-tasks' },
    { label: 'Councils', value: '5', trend: '0%', trendColor: 'text-gray-600', trendBg: 'bg-gray-50', iconColor: 'text-purple-600', iconBg: 'bg-purple-50', iconClass: 'fas fa-balance-scale' }
  ];

  tasks = [
    { title: 'Update Server', user: 'John Doe', status: 'In Progress', statusColor: 'bg-purple-50 text-purple-600' },
    { title: 'Review Policy', user: 'Jane Smith', status: 'Pending', statusColor: 'bg-orange-50 text-orange-600' },
    { title: 'Onboard Client', user: 'Mike Ross', status: 'Completed', statusColor: 'bg-green-50 text-green-600' },
    { title: 'Audit Logs', user: 'Sarah Connor', status: 'Queued', statusColor: 'bg-gray-100 text-gray-600' },
    { title: 'Marketing Sync', user: 'Alex T.', status: 'Done', statusColor: 'bg-green-50 text-green-600' }
  ];
}
