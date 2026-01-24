import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { Icouncils } from '../../../interfaces/icouncils';
import { SearchcouncilsPipe } from '../../../pipes/searchcouncils/searchcouncils.pipe';
import { Iusers } from '../../../interfaces/iusers';
import { UsersService } from '../../../../core/services/users/users.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-councils',
  imports: [CommonModule, FormsModule, DatePipe, SearchcouncilsPipe],
  templateUrl: './councils.component.html',
  styleUrl: './councils.component.scss'
})
export class CouncilsComponent {
  private readonly councilsService = inject(CouncilsService);
  private readonly usersService = inject(UsersService);
  CouncilList: Icouncils[] = [];
  text: string = "";
  headList: Iusers[] = [];
  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedCouncilId: string | null = null;

  // Form Data
  councilData = {
    name: '',
    description: '',
    head_id: ''
  };
  ngOnInit(): void {
    this.GetCouncils();
  }
  // GetHeads(): void {
  //   this.usersService.GetUserListByRole("Head").subscribe({
  //     next: (res) => {
  //       this.headList = res.data;
  //     }
  //   });
  // }
  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        this.CouncilList = res.data;
      }
    });
  }

  openAddModal(): void {
    // this.GetHeads();
    this.isEditMode = false;
    this.selectedCouncilId = null;
    this.councilData = { name: '', description: '', head_id: '' };
    this.isModalOpen = true;
  }

  openEditModal(council: Icouncils): void {
    // this.GetHeads();
    this.isEditMode = true;
    this.selectedCouncilId = council.id;
    this.councilData = {
      name: council.name,
      description: council.description,
      head_id: council.head
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedCouncilId) {
      this.councilsService.UpdateCouncil({ ...this.councilData, id: this.selectedCouncilId }).subscribe({
        next: () => {
          this.GetCouncils();
          this.closeModal();
        }
      });
    } else {
      this.councilsService.AddCouncil(this.councilData).subscribe({
        next: () => {
          this.GetCouncils();
          this.closeModal();
        }
      });
    }
  }

  deleteCouncil(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this council!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.councilsService.DeleteCouncil(id).subscribe({
          next: () => {
            this.GetCouncils();
            Swal.fire('Deleted!', 'The council has been deleted.', 'success');
          }
        });
      }
    });
  }

}
