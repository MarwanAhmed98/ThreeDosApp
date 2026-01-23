import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delegatesdashboard',
  imports: [CommonModule],
  templateUrl: './delegatesdashboard.component.html',
  styleUrl: './delegatesdashboard.component.scss'
})
export class DelegatesdashboardComponent {
  UserName: string = localStorage.getItem('UserName') || 'Admin';

  metrics = [
    {
      label: 'GPA / Points',
      value: '3.8 / 1250',
      trend: '+0.2',
      iconClass: 'fas fa-graduation-cap',
      iconBg: 'bg-brand-purple/10',
      iconColor: 'text-brand-purple',
      trendBg: 'bg-emerald-50',
      trendColor: 'text-emerald-500'
    },
    {
      label: 'Attendance',
      value: '94%',
      trend: '+2%',
      iconClass: 'fas fa-calendar-check',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      trendBg: 'bg-emerald-50',
      trendColor: 'text-emerald-500'
    },
    {
      label: 'Pending Tasks',
      value: '5',
      trend: '-2',
      iconClass: 'fas fa-tasks',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      trendBg: 'bg-rose-50',
      trendColor: 'text-rose-500'
    },
    {
      label: 'Activity Hours',
      value: '24h',
      trend: '+4h',
      iconClass: 'fas fa-clock',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      trendBg: 'bg-emerald-50',
      trendColor: 'text-emerald-500'
    },
  ];

  tasks = [
    { title: 'Advanced Angular Workshop', group: 'Frontend Council', status: 'IN PROGRESS', statusColor: 'bg-purple-50 text-purple-600' },
    { title: 'Submit UI Design System', group: 'Design Club', status: 'PENDING', statusColor: 'bg-amber-50 text-amber-600' },
    { title: 'Algorithm Research Paper', group: 'CS Society', status: 'PENDING', statusColor: 'bg-amber-50 text-amber-600' },
    { title: 'Community Service Event', group: 'Volunteers', status: 'COMPLETED', statusColor: 'bg-emerald-50 text-emerald-600' },
  ];
}
