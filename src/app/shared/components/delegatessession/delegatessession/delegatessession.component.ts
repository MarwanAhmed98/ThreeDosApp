import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { AttendancesService } from '../../../../core/services/attendances/attendances.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ISession } from '../../../interfaces/isession';

interface SessionWithStatus extends ISession {
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  isJoined: boolean;
  time?: string;
  attendance_count?: number;
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
  private readonly attendancesService = inject(AttendancesService);
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  // Signals for state management
  sessions = signal<SessionWithStatus[]>([]);
  loading = signal(false);
  text = signal('');
  currentPage = signal(1);
  totalPages = signal(1);
  selectedSession = signal<SessionWithStatus | null>(null);
  isDetailsModalOpen = signal(false);
  sessionDetails = signal<any>(null);
  loadingDetails = signal(false);

  // Computed filtered sessions
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
        if (response.status === 'success') {
          const sessionsData = response.data.data;
          this.totalPages.set(response.data.pagination?.last_page || 1);

          // Transform sessions and determine status
          const transformedSessions: SessionWithStatus[] = sessionsData.map((session: any) => ({
            ...session,
            status: this.determineSessionStatus(session.date),
            isJoined: false, // Will be updated when we load attendance data
            time: this.extractTimeFromDate(session.date),
            council: session.council?.name || 'Unknown Council',
            council_id: session.council?.id || session.council_id
          }));

          this.sessions.set(transformedSessions);
          this.loadAttendanceStatus();
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error('Failed to load sessions', 'Error');
        this.loading.set(false);
      }
    });
  }

  private loadAttendanceStatus(): void {
    // Load user's attendance records to determine which sessions they've joined
    this.attendancesService.GetAttendanceList(1, 100).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          const attendances = response.data.data;
          const currentUser = this.authService.getCurrentUser();

          if (currentUser) {
            // Update sessions with attendance status
            const updatedSessions = this.sessions().map(session => ({
              ...session,
              isJoined: attendances.some((attendance: any) =>
                attendance.council_session_id === session.id &&
                attendance.user_id === currentUser.id.toString()
              )
            }));
            this.sessions.set(updatedSessions);
          }
        }
      },
      error: () => {
        // Silently fail - attendance status is not critical
      }
    });
  }

  private determineSessionStatus(dateString: string): 'LIVE' | 'UPCOMING' | 'COMPLETED' {
    const sessionDate = new Date(dateString);
    const now = new Date();
    const sessionEndTime = new Date(sessionDate.getTime() + (2 * 60 * 60 * 1000)); // Assume 2-hour sessions

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

  joinSession(sessionId: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastr.error('Please log in to join sessions', 'Authentication Required');
      return;
    }

    const session = this.sessions().find(s => s.id === sessionId);
    if (!session) {
      this.toastr.error('Session not found', 'Error');
      return;
    }

    if (session.isJoined) {
      this.toastr.info('You are already registered for this session', 'Already Registered');
      return;
    }

    this.loading.set(true);

    // Create an attendance record to represent "joining" the session
    const attendanceData = {
      user_id: currentUser.id.toString(),
      council_session_id: sessionId,
      status: 'Registered', // Custom status for pre-registration
      council_id: currentUser.council_id || session.council_id || ''
    };

    this.attendancesService.AddAttendance(attendanceData).subscribe({
      next: () => {
        // Update the session status locally
        const updatedSessions = this.sessions().map(s =>
          s.id === sessionId ? { ...s, isJoined: true } : s
        );
        this.sessions.set(updatedSessions);

        this.toastr.success('Successfully registered for the session!', 'Registration Confirmed');
        this.loading.set(false);
      },
      error: (error) => {
        this.toastr.error('Failed to register for session. Please try again.', 'Registration Failed');
        this.loading.set(false);
      }
    });
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

  // Session details methods
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
