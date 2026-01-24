import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService } from '../../../../core/services/teams/teams.service';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { SearchteamsPipe } from '../../../pipes/searchteams/searchteams.pipe';
import { ITeam, ITeamMember } from '../../../interfaces/iteams';
import { Icouncils } from '../../../interfaces/icouncils';
import { Iusers } from '../../../interfaces/iusers';
import Swal from 'sweetalert2';

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
  private readonly toastr = inject(ToastrService);

  TeamsList: ITeam[] = [];
  CouncilList: Icouncils[] = [];
  UserList: Iusers[] = [];
  SelectedTeamMembers: ITeamMember[] = [];
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
        this.TeamsList = res.data || res;
      },
      error: () => {
        this.toastr.error('Failed to load teams', 'Error');
      }
    });
  }

  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data || res;
      },
      error: () => {
        this.toastr.error('Failed to load councils', 'Error');
      }
    });
  }

  GetUsers(): void {
    this.usersService.GetUsersByCouncil().subscribe({
      next: (res) => {
        this.UserList = res.data?.data || res.data || res;
      },
      error: () => {
        this.toastr.error('Failed to load users', 'Error');
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
    if (!this.teamData.team_number || !this.teamData.council_id) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    this.teamsService.AddTeam(this.teamData).subscribe({
      next: () => {
        this.toastr.success('Team created successfully', 'Success');
        this.GetTeams();
        this.closeTeamModal();
      },
      error: (error) => {
        let errorMessage = 'Failed to create team';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
        this.toastr.error(errorMessage, 'Creation Error');
      }
    });
  }

  openViewMembersModal(team: ITeam): void {
    if (!team.id) {
      this.toastr.error('Team ID is missing', 'Error');
      return;
    }

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
        this.SelectedTeamMembers = res.data?.team_members || [];
      },
      error: () => {
        this.toastr.error('Failed to load team members', 'Error');
        this.SelectedTeamMembers = [];
      }
    });
  }

  openMemberModal(teamId: string): void {
    if (!teamId) {
      this.toastr.error('Team ID is missing', 'Error');
      return;
    }

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
    if (!this.memberData.user_id) {
      this.toastr.error('Please select a user', 'Validation Error');
      return;
    }

    this.teamsService.AddTeamMember(this.memberData).subscribe({
      next: () => {
        this.toastr.success('Member added successfully', 'Success');
        if (this.selectedTeamId) {
          this.GetTeamMembers(this.selectedTeamId);
        }
        this.closeMemberModal();
      },
      error: (error) => {
        let errorMessage = 'Failed to add member';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.error && error.error.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
        this.toastr.error(errorMessage, 'Addition Error');
      }
    });
  }

  deleteTeam(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will also remove all team members.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete team!',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.teamsService.DeleteTeam(id).subscribe({
          next: () => {
            this.toastr.success('Team deleted successfully', 'Success');
            this.GetTeams();
          },
          error: () => {
            this.toastr.error('Failed to delete team', 'Error');
          }
        });
      }
    });
  }

  deleteMember(memberId: string): void {
    if (!memberId) {
      this.toastr.error('Member ID is missing', 'Error');
      return;
    }

    if (this.selectedTeamId) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Remove this member from team?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove',
        cancelButtonText: 'Cancel'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.teamsService.DeleteTeamMember(memberId).subscribe({
            next: () => {
              this.toastr.success('Member removed successfully', 'Success');
              this.GetTeamMembers(this.selectedTeamId!);
            },
            error: () => {
              this.toastr.error('Failed to remove member', 'Error');
            }
          });
        }
      });
    }
  }


  getRoleClass(role: string) {
    switch (role?.toLowerCase()) {
      case 'leader': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400';
      case 'co-leader': return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400';
    }
  }

  getCouncilName(councilId: string): string {
    const council = this.CouncilList.find(c => c.id === councilId);
    return council?.name || 'Unknown Council';
  }

  getUserName(userId: string): string {
    const user = this.UserList.find(u => u.id === userId);
    return user?.name || 'Unknown User';
  }
}
