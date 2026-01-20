import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Itask } from '../../../interfaces/itask';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { SearchtasksPipe } from '../../../pipes/searchtasks/searchtasks.pipe';
@Component({
  selector: 'app-tasksmangement',
  imports: [CommonModule, FormsModule, SearchtasksPipe],
  templateUrl: './tasksmangement.component.html',
  styleUrl: './tasksmangement.component.scss'
})
export class TasksmangementComponent implements OnInit {
  private readonly tasksService = inject(TasksService);
  text: string = "";
  currentPage: number = 1;
  lastpage: number = 1;
  perPages: number = 1;
  totalTasks: number = 1;
  TasksList: Itask[] = [];
  ngOnInit(): void {
    this.GetTasksList();
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
    this.tasksService.GetUserList(this.currentPage).subscribe({
      next: (res) => {
        console.log(res);
        this.TasksList = res.data.data;
        console.log(this.TasksList);
        // this.currentPage = res.data.current_page;
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
}