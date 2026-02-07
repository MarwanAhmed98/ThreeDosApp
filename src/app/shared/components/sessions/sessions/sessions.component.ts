import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { ISession } from '../../../interfaces/isession';
import { SearchsessionsPipe } from '../../../pipes/searchsessions/searchsessions.pipe';
import Swal from 'sweetalert2';
import { Icouncils } from '../../../interfaces/icouncils';

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SearchsessionsPipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent implements OnInit, AfterViewInit {
  private readonly sessionsService = inject(SessionsService);
  private readonly councilsService = inject(CouncilsService);

  SessionList: ISession[] = [];
  CouncilList: Icouncils[] = [];
  text: string = "";
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;
  totalCouncils: number = 1;

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedSessionId: string | null = null;

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
    });
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

    // تحويل التاريخ لصيغة YYYY-MM-DDTHH:mm لكي يظهر في الـ input
    let formattedDate = '';
    if (session.date) {
      const d = new Date(session.date);
      formattedDate = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0') + 'T' +
        String(d.getHours()).padStart(2, '0') + ':' +
        String(d.getMinutes()).padStart(2, '0');
    }

    this.sessionData = {
      title: session.title,
      date: formattedDate,
      description: session.description,
      material: session.material,
      // نستخدم council_id لضمان اختيار الـ Option الصحيح في الـ Select
      council_id: session.council_id ? session.council_id.toString() : ''
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
          Swal.fire('Updated!', 'Session has been updated.', 'success');
        }
      });
    } else {
      this.sessionsService.AddSession(this.sessionData).subscribe({
        next: () => {
          this.GetSessionsList();
          this.closeModal();
          Swal.fire('Created!', 'Session has been created.', 'success');
        }
      });
    }
  }

  deleteSession(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this session!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.sessionsService.DeleteSession(id).subscribe({
          next: () => {
            this.GetSessionsList();
            Swal.fire('Deleted!', 'The session has been deleted.', 'success');
          }
        });
      }
    });
  }

  ngAfterViewInit(): void { }
}