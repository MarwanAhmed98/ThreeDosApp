import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskSubmissionsService } from '../../../../core/services/task-submissions/task-submissions.service';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { ITaskSubmission } from '../../../interfaces/itask-submission';
import { Itask } from '../../../interfaces/itask';
import { Iusers } from '../../../interfaces/iusers';
import { SearchsubmissionsPipe } from '../../../pipes/searchsubmissions/searchsubmissions.pipe';

@Component({
  selector: 'app-task-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, SearchsubmissionsPipe],
  templateUrl: './task-submissions.component.html',
  styleUrl: './task-submissions.component.scss'
})
export class TaskSubmissionsComponent implements OnInit {
  private readonly submissionsService = inject(TaskSubmissionsService);
  private readonly tasksService = inject(TasksService);
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);

  SubmissionList: any[] = [];
  TasksList: Itask[] = [];
  UsersList: Iusers[] = [];
  text: string = '';
  currentPage: number = 1;
  lastPage: number = 1;
  taskId: string = '';

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedSubmissionId: string | null = null;
  selectedFile: File | null = null;

  // Form Data
  submissionData = {
    task_id: '',
    user_id: '',
   status: '',
    grade: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.taskId = params['taskId'] || '';
      this.GetSubmissions();
      this.GetTasks();
      this.GetUsers();
    });
  }

  GetSubmissions(): void {
    this.submissionsService.GetSubmissionList(this.currentPage, 10, this.taskId).subscribe({
      next: (res) => {
        this.SubmissionList = res.data.data;
        this.lastPage = res.data.pagination.last_page;
      }
    });
  }

  GetTasks(): void {
    this.tasksService.GetTaskList(1, 100).subscribe({
      next: (res) => {
        this.TasksList = res.data.data;
      }
    });
  }

  GetUsers(): void {
    this.usersService.GetUserList(1).subscribe({
      next: (res) => {
        this.UsersList = res.data.data;
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.GetSubmissions();
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedSubmissionId = null;
    this.selectedFile = null;
    this.submissionData = { task_id: '', user_id: '', status: '', grade: '' };
    this.isModalOpen = true;
  }

  openEditModal(submission: any): void {
    this.isEditMode = true;
    this.selectedSubmissionId = submission.id;
    this.submissionData = {
      task_id: submission.task_id,
      user_id: submission.user_id,
      status: 'Graded',
      grade: submission.grade
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedSubmissionId) {
      this.submissionsService.UpdateSubmission(this.selectedSubmissionId, this.submissionData).subscribe({
        next: () => {
          this.GetSubmissions();
          this.closeModal();
        }
      });
    } else {
      if (this.selectedFile && this.submissionData.task_id) {
        this.submissionsService.AddSubmission(this.submissionData.task_id, this.selectedFile).subscribe({
          next: () => {
            this.GetSubmissions();
            this.closeModal();
          }
        });
      }
    }
  }

  deleteSubmission(id: string): void {
    if (confirm('Are you sure you want to delete this submission?')) {
      this.submissionsService.DeleteSubmission(id).subscribe({
        next: () => {
          this.GetSubmissions();
        }
      });
    }
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-50 text-green-600';
      case 'pending': return 'bg-orange-50 text-orange-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50';
    }
  }
}
