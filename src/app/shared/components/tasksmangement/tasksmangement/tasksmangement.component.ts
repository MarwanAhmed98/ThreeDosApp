import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Itask } from '../../../interfaces/itask';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
@Component({
  selector: 'app-tasksmangement',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasksmangement.component.html',
  styleUrl: './tasksmangement.component.scss'
})
export class TasksmangementComponent implements OnInit {
  private readonly tasksService = inject(TasksService);
  text: string = "";
  currentPage: number = 1;
  totalPages: number = 1;
  ngOnInit(): void {
    this.GetTasksList();
  }
  searchQuery = signal('');

  tasks = signal<Itask[]>([
    { id: 1, name: 'Review Q3 Council Budget', deadline: 'Oct 24, 2023', council: 'Treasury', councilColor: 'bg-orange-500', status: 'In Progress', icon: '📄', iconBg: 'bg-purple-100' },
    { id: 2, name: 'Update Security Protocols', deadline: 'Nov 01, 2023', council: 'Tech', councilColor: 'bg-blue-500', status: 'Pending', icon: '🛡️', iconBg: 'bg-blue-100' },
    { id: 3, name: 'Community Governance Vote', deadline: 'Oct 15, 2023', council: 'Governance', councilColor: 'bg-purple-500', status: 'Completed', icon: '🗳️', iconBg: 'bg-pink-100' },
    { id: 4, name: 'Q4 Marketing Blast', deadline: 'Nov 12, 2023', council: 'Marketing', councilColor: 'bg-teal-500', status: 'In Progress', icon: '📢', iconBg: 'bg-teal-100' },
    { id: 5, name: 'Legal Compliance Check', deadline: 'Dec 05, 2023', council: 'Legal', councilColor: 'bg-slate-500', status: 'Pending', icon: '⚖️', iconBg: 'bg-slate-100' },
  ]);

  filteredTasks = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.tasks().filter(task =>
      task.name.toLowerCase().includes(query) ||
      task.council.toLowerCase().includes(query)
    );
  });

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
      }
    })
  }
}
