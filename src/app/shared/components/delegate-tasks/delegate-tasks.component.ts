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

    // Signals for state management
    tasks = signal<TaskWithSubmission[]>([]);
    loading = signal(false);
    searchText = signal('');
    currentPage = signal(1);
    totalPages = signal(1);
    selectedTask = signal<TaskWithSubmission | null>(null);
    isSubmissionModalOpen = signal(false);
    submissionUrl = signal<string>('');

    // Computed values
    filteredTasks = computed(() => {
        const search = this.searchText().toLowerCase();
        return this.tasks().filter(task =>
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search)
        );
    });

    // Form for task submission
    submissionForm: FormGroup = this.fb.group({
        driveUrl: ['', [
            Validators.required,
            (control: any) => {
                const url = control.value;
                if (!url) return null;

                // Basic URL validation
                try {
                    new URL(url);
                } catch {
                    return { invalidUrl: true };
                }

                // Google Drive/Docs validation
                const googlePattern = /^https:\/\/(drive\.google\.com|docs\.google\.com)/;
                if (!googlePattern.test(url)) {
                    return { notGoogleDrive: true };
                }

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

                // Load submission status for each task
                this.loadTasksWithSubmissions(tasksData);
            },
            error: () => {
                this.toastr.error('Failed to load tasks', 'Error');
                this.loading.set(false);
            }
        });
    }

    private loadTasksWithSubmissions(tasksData: Itask[]): void {
        // Get current user's submissions
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
                // If we can't load submissions, just show tasks without submission info
                const tasksWithSubmissions: TaskWithSubmission[] = tasksData.map(task => ({
                    ...task,
                    hasSubmission: false,
                    submissionStatus: 'Unknown'
                }));
                this.tasks.set(tasksWithSubmissions);
                this.loading.set(false);
            }
        });
    }

    onSearchChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchText.set(target.value);
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            this.loadTasks();
        }
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
        const target = event.target as HTMLInputElement;
        const url = target.value;
        this.submissionUrl.set(url);

        // Validate Google Drive URL
        if (url && this.validateGoogleDriveUrl(url)) {
            // Test file ID extraction
            const fileId = this.extractFileIdFromUrl(url);
            if (fileId) {
                this.toastr.success(`File ID extracted successfully: ${fileId.substring(0, 10)}...`, 'URL Valid');
            } else {
                this.toastr.warning('Valid Google Drive URL but could not extract file ID. Please try a different URL format.', 'URL Warning');
            }
        }
    }

    private validateGoogleDriveUrl(url: string): boolean {
        if (!url) return false;

        // Check if it's a valid URL first
        try {
            new URL(url);
        } catch {
            this.toastr.warning('Please provide a valid URL', 'Invalid URL');
            return false;
        }

        // Check if it's a Google Drive or Google Docs URL
        const googleDrivePattern = /^https:\/\/(drive\.google\.com|docs\.google\.com)/;
        const isGoogleUrl = googleDrivePattern.test(url);

        if (!isGoogleUrl) {
            this.toastr.warning('Please provide a valid Google Drive or Google Docs link', 'Invalid URL');
            return false;
        }

        // Check if we can extract a file ID
        const fileId = this.extractFileIdFromUrl(url);
        if (!fileId) {
            this.toastr.warning('Unable to extract file ID from this URL. Please ensure you\'re using a valid Google Drive sharing link.', 'Invalid URL Format');
            return false;
        }

        return true;
    }

    extractFileIdFromUrl(url: string): string | null {
        if (!url) return null;

        console.log('Extracting file ID from URL:', url); // Debug log

        // Clean the URL first - remove any trailing parameters that might interfere
        const cleanUrl = url.split('?')[0].split('#')[0];

        // Extract file ID from various Google Drive URL formats
        const patterns = [
            // Standard Google Drive file URLs
            /\/file\/d\/([a-zA-Z0-9-_]{25,})/,
            // Google Docs URLs
            /\/document\/d\/([a-zA-Z0-9-_]{25,})/,
            // Google Sheets URLs
            /\/spreadsheets\/d\/([a-zA-Z0-9-_]{25,})/,
            // Google Slides URLs
            /\/presentation\/d\/([a-zA-Z0-9-_]{25,})/,
            // URL parameter format
            /[?&]id=([a-zA-Z0-9-_]{25,})/,
            // Alternative formats
            /\/open\?id=([a-zA-Z0-9-_]{25,})/,
            // Sharing URLs with view/edit
            /\/file\/d\/([a-zA-Z0-9-_]{25,})\/(?:view|edit)/,
            // More flexible patterns for drive.google.com
            /drive\.google\.com\/.*\/([a-zA-Z0-9-_]{25,})/,
            // More flexible patterns for docs.google.com
            /docs\.google\.com\/.*\/([a-zA-Z0-9-_]{25,})/
        ];

        // Try each pattern
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            const match = url.match(pattern);
            if (match && match[1]) {
                const fileId = match[1];
                console.log(`Pattern ${i + 1} matched, extracted ID:`, fileId);

                // Validate the file ID format
                if (fileId.length >= 25 && fileId.length <= 50 && /^[a-zA-Z0-9-_]+$/.test(fileId)) {
                    return fileId;
                }
            }
        }

        // Try to extract from the full URL using a more general approach
        const generalPattern = /([a-zA-Z0-9-_]{28,44})/g;
        const matches = [...url.matchAll(generalPattern)];

        if (matches.length > 0) {
            // Look for the most likely file ID (usually the longest valid string)
            const candidates = matches
                .map(match => match[1])
                .filter(id => id.length >= 28 && id.length <= 44)
                .sort((a, b) => b.length - a.length);

            if (candidates.length > 0) {
                console.log('Using general pattern match:', candidates[0]);
                return candidates[0];
            }
        }

        console.warn('Could not extract file ID from URL:', url);
        return null;
    }

    getFileTypeFromUrl(url: string): string {
        if (url.includes('docs.google.com/document')) return 'Google Docs';
        if (url.includes('docs.google.com/spreadsheets')) return 'Google Sheets';
        if (url.includes('docs.google.com/presentation')) return 'Google Slides';
        if (url.includes('drive.google.com')) return 'Google Drive File';
        return 'Google Drive Link';
    }

    submitTask(): void {
        const task = this.selectedTask();
        const url = this.submissionUrl();

        if (!task) {
            this.toastr.error('Task information is missing', 'Error');
            return;
        }

        if (!url || !this.validateGoogleDriveUrl(url)) {
            this.toastr.error('Please provide a valid Google Drive link', 'Invalid URL');
            return;
        }

        if (this.submissionForm.invalid) {
            this.toastr.error('Please fill in all required fields correctly', 'Form Error');
            return;
        }

        const fileId = this.extractFileIdFromUrl(url);
        if (!fileId) {
            this.toastr.error(
                'Unable to extract file ID from the Google Drive URL. Please ensure you\'re using a valid Google Drive sharing link. Check the console for debugging information.',
                'Invalid URL Format'
            );
            return;
        }

        this.loading.set(true);

        // Ensure the URL is in a shareable format
        const shareableUrl = this.ensureShareableUrl(url);

        const submissionData = {
            task_id: task.id,
            file: shareableUrl,
            file_id: fileId,
            comment: this.submissionForm.get('comment')?.value || '',
            file_type: this.getFileTypeFromUrl(url)
        };

        this.submissionsService.AddSubmissionWithUrl(submissionData).subscribe({
            next: () => {
                this.loading.set(false);
                this.toastr.success('Task submitted successfully', 'Success');

                // Update the task status to completed
                const currentTasks = this.tasks();
                const updatedTasks = currentTasks.map(t =>
                    t.id === task.id
                        ? {
                            ...t,
                            hasSubmission: true,
                            submissionStatus: 'completed',
                            submissionDate: new Date().toISOString()
                        }
                        : t
                );
                this.tasks.set(updatedTasks);

                this.closeSubmissionModal();
            },
            error: (error) => {
                this.loading.set(false);
                console.error('Submission error:', error);
                let errorMessage = 'Failed to submit task';

                if (error.error && error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error && error.error.errors) {
                    const validationErrors = Object.values(error.error.errors).flat();
                    errorMessage = validationErrors.join(', ');
                }

                this.toastr.error(errorMessage, 'Submission Error');
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'approved':
                return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
            case 'in progress':
            case 'pending':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
            case 'rejected':
                return 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400';
            case 'not submitted':
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
            default:
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
        }
    }

    getTaskStatusClass(status: string): string {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400';
            case 'in progress':
                return 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
            case 'pending':
                return 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
            default:
                return 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
        }
    }

    isTaskOverdue(dueDate: string): boolean {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    getDriveIcon(url: string): string {
        if (url.includes('docs.google.com/document')) return 'fab fa-google text-blue-500';
        if (url.includes('docs.google.com/spreadsheets')) return 'fas fa-table text-green-500';
        if (url.includes('docs.google.com/presentation')) return 'fas fa-presentation text-orange-500';
        return 'fab fa-google-drive text-blue-600';
    }

    // Helper method to ensure the URL is in a shareable format
    private ensureShareableUrl(url: string): string {
        const fileId = this.extractFileIdFromUrl(url);
        if (!fileId) return url;

        // If it's already a proper sharing URL, return as is
        if (url.includes('/view') || url.includes('/edit') || url.includes('sharing')) {
            return url;
        }

        // Convert to a standard shareable format
        return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    }

    // Helper method to provide user-friendly instructions
    getShareInstructions(): string {
        return `To share your Google Drive file:
1. Open your file in Google Drive
2. Click the "Share" button
3. Change access to "Anyone with the link"
4. Set permission to "Viewer" or "Commenter"
5. Copy and paste the link here`;
    }

    // Helper method to provide example URLs for testing
    getExampleUrls(): string[] {
        return [
            'https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view?usp=sharing',
            'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
            'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing'
        ];
    }
}