import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delegatessession',
  imports: [CommonModule, FormsModule],
  templateUrl: './delegatessession.component.html',
  styleUrl: './delegatessession.component.scss'
})
export class DelegatessessionComponent {
  text = '';

  // Student-specific session list
  sessions = signal([
    {
      id: 1,
      date: new Date(),
      time: '04:00 PM',
      title: 'Advanced Angular Signals',
      council: 'Frontend Council',
      description: 'Deep dive into Angular 19 signals and state management patterns.',
      status: 'LIVE', // LIVE, UPCOMING, COMPLETED
      material: 'https://angular.dev',
      isJoined: false
    },
    {
      id: 2,
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '02:00 PM',
      title: 'UI UX Design System',
      council: 'Design Club',
      description: 'Learning how to build consistent design systems for web apps.',
      status: 'UPCOMING',
      material: null,
      isJoined: false
    },
    {
      id: 3,
      date: new Date(Date.now() - 86400000), // Yesterday
      time: '10:00 AM',
      title: 'Backend API Security',
      council: 'Backend Council',
      description: 'Understanding JWT, OAuth2 and best security practices.',
      status: 'COMPLETED',
      material: 'https://google.com',
      isJoined: true
    }
  ]);

  joinSession(id: number) {
    this.sessions.update(items =>
      items.map(s => s.id === id ? { ...s, isJoined: true } : s)
    );
    alert('Successfully registered for the session!');
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'LIVE': return 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 animate-pulse';
      case 'UPCOMING': return 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20';
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20';
      default: return 'bg-slate-50 text-slate-600';
    }
  }
}
