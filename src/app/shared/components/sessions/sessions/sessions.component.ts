import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { ISession } from '../../../interfaces/isession';
import { Icouncils } from '../../../interfaces/icouncils';
import { SearchsessionsPipe } from '../../../pipes/searchsessions/searchsessions.pipe';
@Component({
  selector: 'app-sessions',
  imports: [CommonModule, FormsModule , DatePipe , SearchsessionsPipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {
  private readonly sessionsService = inject(SessionsService);
  private readonly councilsService = inject(CouncilsService);
  SessionList: ISession[] = [];
  CouncilList: Icouncils[] = [];
  text: string = "";
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;
  totalCouncils: number = 1;

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedSessionId: string | null = null;

  // Form Data
  sessionData = {
    title: '',
    date: '',
    description: '',
    material: '',
    council_id: ''
  };
  ngOnInit(): void {
    this.GetSessionsList();
    this.GetCouncils();
  }
  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data;
      }
    });
  }
  GetSessionsList(): void {
    this.sessionsService.GetSessionlList(this.currentPage).subscribe({
      next: (res) => {
        console.log(res);
        this.SessionList = res.data.data;
        this.perPages = res.data.pagination.per_page;
        this.lastpage = res.data.pagination.last_page;
        this.totalCouncils = res.data.pagination.total;
      }
    })
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.lastpage) {
      this.currentPage = page;
      this.GetSessionsList();
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedSessionId = null;
    this.sessionData = { title: '', date: '', description: '', material: '', council_id: '' };
    this.isModalOpen = true;
  }

  openEditModal(session: ISession): void {
    this.isEditMode = true;
    this.selectedSessionId = session.id;
    this.sessionData = {
      title: session.title,
      date: session.date,
      description: session.description,
      material: session.material,
      council_id: session.council
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedSessionId) {
      this.sessionsService.UpdateSession(this.selectedSessionId, this.sessionData).subscribe({
        next: () => {
          this.GetSessionsList();
          this.closeModal();
        }
      });
    } else {
      this.sessionsService.AddSession(this.sessionData).subscribe({
        next: () => {
          this.GetSessionsList();
          this.closeModal();
        }
      });
    }
  }

  deleteSession(id: string): void {
    if (confirm('Are you sure you want to delete this session?')) {
      this.sessionsService.DeleteSession(id).subscribe({
        next: () => {
          this.GetSessionsList();
        }
      });
    }
  }
}
