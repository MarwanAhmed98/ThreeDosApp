import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { Idelegatesteams } from '../../../interfaces/idelegatesteams';
import { DelegatesteamsPipe } from '../../../pipes/searchdelegatesteams/delegatesteams.pipe';

@Component({
  selector: 'app-delegatesteams',
  imports: [CommonModule, FormsModule , DelegatesteamsPipe ],
  templateUrl: './delegatesteams.component.html',
  styleUrl: './delegatesteams.component.scss'
})
export class DelegatesteamsComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly authService = inject(AuthService);

  TeamsList: Idelegatesteams[] = [];
  studentInfo: any = null; 

  selectedTeam: Idelegatesteams | null = null;
  isViewTeamModalOpen: boolean = false;

  text: string = '';

  ngOnInit(): void {
    this.authService.GetMe().subscribe({
      next: (res: any) => {
        this.studentInfo = res.data || res;
        this.GetTeamsOfStudent();
      },
      error: (err) => {
        console.error('Error fetching user info', err);
      }
    });
  }

  GetTeamsOfStudent(): void {
    if (!this.authService.StudentId) return;

    this.teamsService.GetStudentTeams(this.authService.StudentId).subscribe({
      next: (res) => {
        this.TeamsList = res.data;
        console.log('Teams of Student:', this.TeamsList);
      }
    });
  }

  openViewTeamModal(team: Idelegatesteams) {
    this.selectedTeam = team;
    this.isViewTeamModalOpen = true;
  }

  closeViewTeamModal() {
    this.isViewTeamModalOpen = false;
    this.selectedTeam = null;
  }
}