import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksService } from '../../../core/services/tasks/tasks.service';
import { TaskSubmissionsService } from '../../../core/services/task-submissions/task-submissions.service';
import { ToastrService } from 'ngx-toastr';
import { Itask } from '../../interfaces/itask';
import { SearchtasksPipe } from '../../pipes/searchtasks/searchtasks.pipe';

interface TaskWithSubmission extends Itask {
    hasSubmission?: boolean;
    submissionStatus?: string;
    submissionId?: string;
    submissionDate?: string;
}

@Component({
    selector: 'app-delegate-tasks',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, SearchtasksPipe],
    templateUrl: './delegate-tasks.component.html',
    styleUrl: './delegate-tasks.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DelegateTasksComponent implements OnInit {
    private readonly tasksService = inject(TasksService);
    private readonly submissionsService = inject(TaskSubmissionsService);
    private readonly toastr = inject(ToastrService);
    private readonly fb = inject(FormBuilder);

    tasks = signal<TaskWithSubmission[]>([]);
    loading = signal(false);
    searchText = signal('');
    currentPage = signal(1);
    totalPages = signal(1);
    selectedTask = signal<TaskWithSubmission | null>(null);
    isSubmissionModalOpen = signal(false);
    submissionUrl = signal<string>('');

    filteredTasks = computed(() => {
        const search = this.searchText().toLowerCase();
        return this.tasks().filter(task =>
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search)
        );
    });

    submissionForm: FormGroup = this.fb.group({
        driveUrl: ['', [
            Validators.required,
            (control: any) => {
                const url = control.value;
                if (!url) return null;
                try { new URL(url); } catch { return { invalidUrl: true }; }
                const validPattern = /^https:\/\/(drive\.google\.com|docs\.google\.com|github\.com)/;
                if (!validPattern.test(url)) return { invalidDomain: true };
                return null;
            }
        ]],
        comment: ['', [Validators.maxLength(500)]]
    });

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.loading.set(true);
        this.tasksService.GetTaskList(this.currentPage(), 10).subscribe({
            next: (response) => {
                const tasksData = response.data.data;
                this.totalPages.set(response.data.pagination.last_page);
                this.loadTasksWithSubmissions(tasksData);
            },
            error: () => {
                this.toastr.error('Failed to load tasks', 'Error');
                this.loading.set(false);
            }
        });
    }

    private loadTasksWithSubmissions(tasksData: Itask[]): void {
        this.submissionsService.GetSubmissionList(1, 100).subscribe({
            next: (submissionResponse) => {
                const userSubmissions = submissionResponse.data.data;
                const tasksWithSubmissions: TaskWithSubmission[] = tasksData.map(task => {
                    const submission = userSubmissions.find((sub: any) => sub.task_id === task.id);
                    return {
                        ...task,
                        hasSubmission: !!submission,
                        submissionStatus: submission?.status || 'Not Submitted',
                        submissionId: submission?.id,
                        submissionDate: submission?.created_at
                    };
                });
                this.tasks.set(tasksWithSubmissions);
                this.loading.set(false);
            },
            error: () => {
                this.tasks.set(tasksData.map(t => ({ ...t, hasSubmission: false, submissionStatus: 'Unknown' })));
                this.loading.set(false);
            }
        });
    }

    onSearchChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchText.set(target.value);
    }

    changePage(page: number): void {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);
        this.loadTasks();
    }

    openSubmissionModal(task: TaskWithSubmission): void {
        this.selectedTask.set(task);
        this.isSubmissionModalOpen.set(true);
        this.submissionForm.reset();
        this.submissionUrl.set('');
    }

    closeSubmissionModal(): void {
        this.isSubmissionModalOpen.set(false);
        this.selectedTask.set(null);
        this.submissionForm.reset();
        this.submissionUrl.set('');
    }

    onUrlChange(event: Event): void {
        const url = (event.target as HTMLInputElement).value;
        this.submissionUrl.set(url);
    }

    private validateSubmissionUrl(url: string): boolean {
        if (!url) return false;
        try { new URL(url); } catch { return false; }
        return /^https:\/\/(drive\.google\.com|docs\.google\.com|github\.com)/.test(url);
    }

    extractFileIdFromUrl(url: string): string | null {
        if (url.includes('github.com')) return url;

        const clean = url.split('?')[0].split('#')[0];

        const patterns = [
            /\/d\/([a-zA-Z0-9_-]{25,})/,
            /[?&]id=([a-zA-Z0-9_-]{25,})/,
            /\/open\?id=([a-zA-Z0-9_-]{25,})/,
            /([a-zA-Z0-9_-]{28,44})/
        ];

        for (const p of patterns) {
            const m = clean.match(p);
            if (m?.[1]) return m[1];
        }
        return null;
    }

    getFileTypeFromUrl(url: string): string {
        if (url.includes('github.com')) return 'GitHub';
        if (url.includes('/document')) return 'Google Docs';
        if (url.includes('/spreadsheets')) return 'Google Sheets';
        if (url.includes('/presentation')) return 'Google Slides';
        return 'Google Drive';
    }

    submitTask(): void {
        const task = this.selectedTask();
        if (!task) {
            this.toastr.error('No task selected', 'Error');
            return;
        }

        const rawUrl = this.submissionForm.get('driveUrl')?.value?.trim() ?? '';
        if (!rawUrl || !this.validateSubmissionUrl(rawUrl)) {
            this.toastr.error('Please enter a valid Google Drive or GitHub link', 'Invalid URL');
            return;
        }

        if (this.submissionForm.invalid) {
            this.toastr.warning('Please fix the form errors', 'Invalid Form');
            return;
        }

        const fileId = this.extractFileIdFromUrl(rawUrl);
        if (!fileId) {
            this.toastr.error('Could not extract file/repo identifier', 'Invalid Link');
            return;
        }

        const shareable = this.ensureShareableUrl(rawUrl);

        const payload = {
            task_id: String(task.id),
            file: String(shareable).trim(),          // ← forced to string
            file_id: String(fileId).trim(),
            comment: String(this.submissionForm.get('comment')?.value ?? '').trim(),
            file_type: this.getFileTypeFromUrl(rawUrl)
        };

        // Debug output - very important for this issue
        console.log('[SUBMIT] Payload being sent:', JSON.stringify(payload, null, 2));
        console.log('[SUBMIT] file type:', typeof payload.file, 'length:', payload.file.length);

        this.loading.set(true);

        this.submissionsService.AddSubmissionWithUrl(payload).subscribe({
            next: () => {
                this.loading.set(false);
                this.toastr.success('Task submitted successfully', 'Success');

                this.tasks.update(tasks =>
                    tasks.map(t =>
                        t.id === task.id
                            ? { ...t, hasSubmission: true, submissionStatus: 'completed', submissionDate: new Date().toISOString() }
                            : t
                    )
                );

                this.closeSubmissionModal();
            },
            error: (err) => {
                this.loading.set(false);
                console.error('[SUBMIT ERROR]', err);

                if (err.status === 422 && err.error?.errors) {
                    const msg = Object.entries(err.error.errors as Record<string, string[]>)
                        .map(([k, v]) => `${k}: ${v.join(', ')}`)
                        .join('\n');
                    this.toastr.error(msg || 'Validation failed', 'Submission Error', { timeOut: 10000 });
                } else {
                    this.toastr.error(err.error?.message || 'Failed to submit task', 'Error');
                }
            }
        });
    }

    private ensureShareableUrl(url: string): string {
        if (url.includes('github.com')) return url;
        const id = this.extractFileIdFromUrl(url);
        if (!id) return url;
        return `https://drive.google.com/file/d/${id}/view?usp=sharing`;
    }

    getStatusClass(status: string): string {
        const s = (status || 'not submitted').toLowerCase();
        if (s.includes('complete') || s.includes('approve')) return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
        if (s.includes('progress') || s.includes('pending')) return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
        if (s.includes('reject')) return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
        return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }

    isTaskOverdue(dueDate: string): boolean {
        return dueDate ? new Date(dueDate) < new Date() : false;
    }

    formatDate(dateString: string): string {
        return dateString
            ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'No due date';
    }

    getDriveIcon(url: string): string {
        if (url.includes('github.com')) return 'fab fa-github';
        if (url.includes('/document')) return 'fab fa-google';
        if (url.includes('/spreadsheets')) return 'fas fa-table';
        if (url.includes('/presentation')) return 'fas fa-chalkboard';
        return 'fab fa-google-drive';
    }
}