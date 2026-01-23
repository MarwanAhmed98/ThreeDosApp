import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { SearchteamsPipe } from '../../../pipes/searchteams/searchteams.pipe';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchteamsPipe],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export class TeamsComponent implements OnInit {
  private readonly teamsService = inject(TeamsService);
  private readonly councilsService = inject(CouncilsService);
  private readonly usersService = inject(UsersService);

  TeamsList: any[] = [];
  CouncilList: any[] = [];
  UserList: any[] = [];
  SelectedTeamMembers: any[] = [];
  text: string = '';

  // Modal States
  isTeamModalOpen: boolean = false;
  isMemberModalOpen: boolean = false;
  isViewMembersModalOpen: boolean = false;
  
  selectedTeamId: string | null = null;
  selectedTeamNumber: string | null = null;

  // Form Data
  teamData = {
    team_number: '',
    council_id: ''
  };

  memberData = {
    team_id: '',
    user_id: '',
    role: 'member' as 'member' | 'leader' | 'co-leader',
    task: '',
    rate: 0
  };

  ngOnInit(): void {
    this.GetTeams();
    this.GetCouncils();
    this.GetUsers();
  }

  GetTeams(): void {
    this.teamsService.GetTeamsList().subscribe({
      next: (res) => {
        this.TeamsList = res.data;
      }
    });
  }

  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data;
      }
    });
  }

  GetUsers(): void {
    this.usersService.GetUsersByCouncil().subscribe({
      next: (res) => {
        this.UserList = res.data.data;
      }
    });
  }

  openTeamModal(): void {
    this.teamData = { team_number: '', council_id: '' };
    this.isTeamModalOpen = true;
  }

  closeTeamModal(): void {
    this.isTeamModalOpen = false;
  }

  onAddTeam(): void {
    this.teamsService.AddTeam(this.teamData).subscribe({
      next: () => {
        this.GetTeams();
        this.closeTeamModal();
      }
    });
  }

  openViewMembersModal(team: any): void {
    this.selectedTeamId = team.id;
    this.selectedTeamNumber = team.team_number;
    this.GetTeamMembers(team.id);
    this.isViewMembersModalOpen = true;
  }

  closeViewMembersModal(): void {
    this.isViewMembersModalOpen = false;
    this.selectedTeamId = null;
    this.SelectedTeamMembers = [];
  }

  GetTeamMembers(teamId: string): void {
    this.teamsService.GetTeamMembers(teamId).subscribe({
      next: (res) => {
        this.SelectedTeamMembers = res.data.team_members;
      }
    });
  }

  openMemberModal(teamId: string): void {
    this.memberData = {
      team_id: teamId,
      user_id: '',
      role: 'member',
      task: '',
      rate: 0
    };
    this.isMemberModalOpen = true;
  }

  closeMemberModal(): void {
    this.isMemberModalOpen = false;
  }

  onAddMember(): void {
    // API expects an array of members
    this.teamsService.AddTeamMember(this.memberData).subscribe({
      next: () => {
        if (this.selectedTeamId) {
          this.GetTeamMembers(this.selectedTeamId);
        }
        this.closeMemberModal();
      }
    });
  }

  deleteTeam(id: string): void {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamsService.DeleteTeam(id).subscribe({
        next: () => this.GetTeams()
      });
    }
  }

  deleteMember(memberId: string): void {
    if (this.selectedTeamId && confirm('Remove this member from team?')) {
      this.teamsService.DeleteTeamMember(memberId).subscribe({
        next: () => this.GetTeamMembers(this.selectedTeamId!)
      });
    }
  }

  getRoleClass(role: string) {
    switch (role?.toLowerCase()) {
      case 'leader': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'co-leader': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  }
}
