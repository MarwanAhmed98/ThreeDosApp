import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Itask, ITaskRequest, ITaskUpdate } from '../../../interfaces/itask';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { SessionsService } from '../../../../core/services/sessions/sessions.service';
import { ISession } from '../../../interfaces/isession';
import { SearchtasksPipe } from '../../../pipes/searchtasks/searchtasks.pipe';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tasksmangement',
  imports: [CommonModule, FormsModule, SearchtasksPipe, RouterModule],
  templateUrl: './tasksmangement.component.html',
  styleUrl: './tasksmangement.component.scss'
})
export class TasksmangementComponent implements OnInit {
  private readonly tasksService = inject(TasksService);
  private readonly sessionsService = inject(SessionsService);
  text: string = "";
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;
  totalTasks: number = 1;
  TasksList: Itask[] = [];
  SessionList: ISession[] = [];

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedTaskId: string | null = null;

  // Form Data
  taskData = {
    title: '',
    description: '',
    status: 'Pending',
    due_date: '',
    council_session_id: ''
  };

  ngOnInit(): void {
    this.GetTasksList();
    this.GetSessions();
  }
  GetSessions(): void {
    // Fetching all sessions for dropdown, might need pagination logic if too many
    this.sessionsService.GetSessionlList(1).subscribe({
      next: (res) => {
        this.SessionList = res.data.data;
      }
    });
  }
  getStatusClass(status: string) {
    switch (status) {
      case 'In Progress': return 'bg-blue-50 text-blue-600';
      case 'Pending': return 'bg-orange-50 text-orange-600';
      case 'Completed': return 'bg-green-50 text-green-600';
      default: return 'bg-gray-50';
    }
  }
  GetTasksList(): void {
    this.tasksService.GetTaskList(this.currentPage).subscribe({
      next: (res) => {
        this.TasksList = res.data.data;
        this.perPages = res.data.pagination.per_page;
        this.lastpage = res.data.pagination.last_page;
        this.totalTasks = res.data.pagination.total;
      }
    })
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.lastpage) {
      this.currentPage = page;
      this.GetTasksList();
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedTaskId = null;
    this.taskData = { title: '', description: '', due_date: '', status: 'Pending', council_session_id: '' };
    this.isModalOpen = true;
  }

  openEditModal(task: ITaskUpdate): void {
    this.isEditMode = true;
    this.selectedTaskId = task.id;
    this.taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      due_date: task.due_date,
      council_session_id: task.council_session_id
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.isEditMode && this.selectedTaskId) {
      this.tasksService.UpdateTask(this.selectedTaskId, this.taskData).subscribe({
        next: () => {
          this.GetTasksList();
          this.closeModal();
        }
      });
    } else {
      this.tasksService.AddTask(this.taskData).subscribe({
        next: () => {
          this.GetTasksList();
          this.closeModal();
        }
      });
    }
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksService.DeleteTask(id).subscribe({
        next: () => {
          this.GetTasksList();
        }
      });
    }
  }
}