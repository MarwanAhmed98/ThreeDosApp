import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { ISession } from '../../../interfaces/isession';
import { SearchsessionsPipe } from '../../../pipes/searchsessions/searchsessions.pipe';
@Component({
  selector: 'app-sessions',
  imports: [CommonModule, FormsModule , DatePipe , SearchsessionsPipe],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss'
})
export class SessionsComponent {
  private readonly sessionsService = inject(SessionsService);
  SessionList: ISession[] = [];
  text: string = "";
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;
  totalCouncils: number = 1;
  ngOnInit(): void {
    this.GetSessionsList();
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
}
