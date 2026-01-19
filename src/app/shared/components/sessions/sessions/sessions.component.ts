import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Session {
  id: string;
  date: string;
  time: string;
  name: string;
  icon: string;
  iconBg: string;
  council: string;
  type: string;
  status: 'Confirmed' | 'Scheduled' | 'Pending Approval';
  isLocked: boolean;
}

@Component({
  selector: 'app-sessions',
  imports: [CommonModule, FormsModule],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {

  searchQuery = signal('');

  sessions = signal<Session[]>([
    {
      id: '1',
      date: 'Oct 24, 2023',
      time: '10:00 AM - 11:30 AM',
      name: 'Q3 Strategy Review',
      icon: 'trending-up',
      iconBg: 'bg-indigo-100 text-indigo-600',
      council: 'Marketing Oversight',
      type: 'Quarterly Review',
      status: 'Confirmed',
      isLocked: false
    },
    {
      id: '2',
      date: 'Oct 25, 2023',
      time: '02:00 PM - 03:00 PM',
      name: 'Budget Allocation',
      icon: 'dollar-sign',
      iconBg: 'bg-orange-100 text-orange-600',
      council: 'Finance & Budget',
      type: 'Emergency',
      status: 'Scheduled',
      isLocked: false
    },
    {
      id: '3',
      date: 'Oct 26, 2023',
      time: '09:00 AM - 10:00 AM',
      name: 'API Deprecation',
      icon: 'code',
      iconBg: 'bg-blue-100 text-blue-600',
      council: 'Tech Innovation',
      type: 'Technical Review',
      status: 'Scheduled',
      isLocked: false
    },
    {
      id: '4',
      date: 'Oct 28, 2023',
      time: '11:00 AM - 12:30 PM',
      name: 'Public Policy',
      icon: 'megaphone',
      iconBg: 'bg-pink-100 text-pink-600',
      council: 'Public Relations',
      type: 'Press Briefing',
      status: 'Pending Approval',
      isLocked: true
    }
  ]);

  filteredSessions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.sessions().filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.council.toLowerCase().includes(query)
    );
  });
}
