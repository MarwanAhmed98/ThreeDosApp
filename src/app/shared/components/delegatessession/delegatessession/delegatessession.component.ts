import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ISession } from '../../../interfaces/isession';

interface SessionWithStatus extends ISession {
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  time?: string;
  council_id?: string;
}

@Component({
  selector: 'app-delegatessession',
  imports: [CommonModule, FormsModule],
  templateUrl: './delegatessession.component.html',
  styleUrl: './delegatessession.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DelegatessessionComponent implements OnInit {
  private readonly sessionsService = inject(SessionsService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  sessions = signal<SessionWithStatus[]>([]);
  loading = signal(false);
  text = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  selectedSession = signal<SessionWithStatus | null>(null);
  isDetailsModalOpen = signal(false);
  sessionDetails = signal<any>(null);
  loadingDetails = signal(false);

  filteredSessions = computed(() => {
    const search = this.text().toLowerCase();
    return this.sessions().filter(session =>
      session.title.toLowerCase().includes(search) ||
      session.council.toLowerCase().includes(search) ||
      session.description?.toLowerCase().includes(search)
    );
  });

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.loading.set(true);
    this.sessionsService.GetSessionlList(this.currentPage()).subscribe({
      next: (response) => {
        console.log(response);
        if (response.status === 'success') {
          const sessionsData = response.data.data;
          this.totalPages.set(response.data.pagination?.last_page || 1);

          const transformedSessions: SessionWithStatus[] = sessionsData.map((session: any) => ({
            ...session,
            status: this.determineSessionStatus(session.date),
            time: this.extractTimeFromDate(session.date),
            council: session.council || 'Unknown Council',
            council_id: session.council?.id || session.council_id
          }));

          this.sessions.set(transformedSessions);
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error('Failed to load sessions', 'Error');
        this.loading.set(false);
      }
    });
  }

  private determineSessionStatus(dateString: string): 'LIVE' | 'UPCOMING' | 'COMPLETED' {
    const sessionDate = new Date(dateString);
    const now = new Date();
    const sessionEndTime = new Date(sessionDate.getTime() + (2 * 60 * 60 * 1000));

    if (now >= sessionDate && now <= sessionEndTime) {
      return 'LIVE';
    } else if (now < sessionDate) {
      return 'UPCOMING';
    } else {
      return 'COMPLETED';
    }
  }

  private extractTimeFromDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'TBD';
    }
  }

  // Generates and downloads an ICS file for the session
  addToCalendar(session: SessionWithStatus): void {
    const title = session.title;
    const description = session.description || 'Session details';

    // Create Date object for Start Time
    let startDate = new Date(session.date);

    if (session.time && session.time !== 'TBD') {
      const timeParts = session.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const meridian = timeParts[3];

        if (meridian) {
          if (meridian.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (meridian.toUpperCase() === 'AM' && hours === 12) hours = 0;
        }

        startDate.setHours(hours, minutes, 0);
      }
    }

    // Format dates for ICS (YYYYMMDDTHHmmssZ)
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    // We calculate the formatted string once
    const timeString = formatICSDate(startDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${timeString}`,
      `DTEND:${timeString}`, // CRITICAL CHANGE: Set End Time exactly equal to Start Time
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      // 'LOCATION:Online',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.toastr.success('Calendar event downloaded', 'Success');
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text.set(target.value);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadSessions();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'LIVE':
        return 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 animate-pulse dark:bg-rose-900/20 dark:text-rose-400';
      case 'UPCOMING':
        return 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-900/20 dark:text-amber-400';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-900/20 dark:text-emerald-400';
      default:
        return 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400';
    }
  }

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  isSessionLive(status: string): boolean {
    return status === 'LIVE';
  }

  isSessionUpcoming(status: string): boolean {
    return status === 'UPCOMING';
  }

  isSessionCompleted(status: string): boolean {
    return status === 'COMPLETED';
  }

  openSessionDetails(session: SessionWithStatus): void {
    this.selectedSession.set(session);
    this.isDetailsModalOpen.set(true);
    this.loadSessionDetails(session.id);
  }

  closeSessionDetails(): void {
    this.isDetailsModalOpen.set(false);
    this.selectedSession.set(null);
    this.sessionDetails.set(null);
  }

  loadSessionDetails(sessionId: string): void {
    this.loadingDetails.set(true);
    this.sessionsService.GetSessionById(sessionId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.sessionDetails.set(response.data);
        }
        this.loadingDetails.set(false);
      },
      error: (error) => {
        this.toastr.error('Failed to load session details', 'Error');
        this.loadingDetails.set(false);
      }
    });
  }
}