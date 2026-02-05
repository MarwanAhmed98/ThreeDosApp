import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskSubmissionsService } from '../../../../core/services/task-submissions/task-submissions.service';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { Itask } from '../../../interfaces/itask';
import { Iusers } from '../../../interfaces/iusers';
import { SearchsubmissionsPipe } from '../../../pipes/searchsubmissions/searchsubmissions.pipe';
import Swal from 'sweetalert2';

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
  submissionUrl: string = ''; // Using URL string instead of File object

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
    this.submissionsService.GetSubmissionByTaskId(this.taskId, this.currentPage, 10).subscribe({
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

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedSubmissionId = null;
    this.submissionUrl = '';
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
          Swal.fire('Success', 'Submission updated successfully', 'success');
        },
        error: (err) => {
           Swal.fire('Error', 'Failed to update submission', 'error');
        }
      });
    } else {
      // Logic for adding submission via URL
      if (this.submissionUrl && this.submissionData.task_id && this.submissionData.user_id) {
        
        const fileId = this.extractFileIdFromUrl(this.submissionUrl);
        const fileType = this.getFileTypeFromUrl(this.submissionUrl);
        // Ensure URL is clean string
        const cleanUrl = this.submissionUrl.trim();

        const newSubmission = {
            task_id: this.submissionData.task_id,
            user_id: this.submissionData.user_id,
            file: cleanUrl,
            file_id: fileId, // Can be null or specific ID
            file_type: fileType,
            status: 'pending'
        };

        this.submissionsService.AddSubmissionWithUrl(newSubmission).subscribe({
          next: () => {
            this.GetSubmissions();
            this.closeModal();
            Swal.fire('Success', 'Submission added successfully', 'success');
          },
          error: (err) => {
             const msg = err.error?.message || 'Failed to add submission';
             Swal.fire('Error', msg, 'error');
          }
        });
      } else {
        Swal.fire('Warning', 'Please fill in all required fields.', 'warning');
      }
    }
  }

  deleteSubmission(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this submission!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.submissionsService.DeleteSubmission(id).subscribe({
          next: () => {
            this.GetSubmissions();
            Swal.fire('Deleted!', 'The submission has been deleted successfully.', 'success');
          }
        });
      }
    });
  }

  getStatusClass(status: string) {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-50 text-green-600';
      case 'pending': return 'bg-orange-50 text-orange-600';
      case 'rejected': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50';
    }
  }

  // Helper to ensure links open correctly
  formatUrl(url: string): string {
    if (!url) return '#';
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url;
    }
    return url;
  }

  extractFileIdFromUrl(url: string): string | null {
    if (!url) return null;
    if (url.includes('github.com')) return url; 

    const patterns = [
        /\/file\/d\/([a-zA-Z0-9-_]{25,})/,
        /\/document\/d\/([a-zA-Z0-9-_]{25,})/,
        /\/spreadsheets\/d\/([a-zA-Z0-9-_]{25,})/,
        /\/presentation\/d\/([a-zA-Z0-9-_]{25,})/,
        /[?&]id=([a-zA-Z0-9-_]{25,})/,
        /\/open\?id=([a-zA-Z0-9-_]{25,})/,
        /\/file\/d\/([a-zA-Z0-9-_]{25,})\/(?:view|edit)/
    ];

    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    return null;
  }

  getFileTypeFromUrl(url: string): string {
    if (url.includes('github.com')) return 'GitHub Link';
    if (url.includes('docs.google.com/document')) return 'Google Docs';
    if (url.includes('docs.google.com/spreadsheets')) return 'Google Sheets';
    if (url.includes('docs.google.com/presentation')) return 'Google Slides';
    if (url.includes('drive.google.com')) return 'Google Drive File';
    return 'Link';
  }
}