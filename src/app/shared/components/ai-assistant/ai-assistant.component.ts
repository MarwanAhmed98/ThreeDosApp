import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../../core/services/ai-chat/ai-chat.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ai-assistant',
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent {
  private readonly aiChatService = inject(AiChatService);
  private readonly toastr = inject(ToastrService);

  userMessage = signal<string>('');
  aiResponse = signal<string>('');
  loading = signal<boolean>(false);
  hasResponse = signal<boolean>(false);

  sendMessage(): void {
    const message = this.userMessage().trim();
    
    if (!message) {
      this.toastr.warning('Please enter a message', 'Empty Message');
      return;
    }

    this.loading.set(true);
    this.hasResponse.set(false);
    this.aiResponse.set('');

    this.aiChatService.sendMessage(message).subscribe({
      next: (response) => {
        this.loading.set(false);
        
        if (response.status === 'success') {
          // Extract the AI response from the data object
          const aiMessage = response.data || 'No response received';
          this.aiResponse.set(aiMessage);
          this.hasResponse.set(true);
          this.toastr.success('Response received', 'Success');
        } else {
          this.toastr.error(response.message || 'Failed to get response', 'Error');
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.error('AI Chat error:', error);
        
        let errorMessage = 'Failed to communicate with AI assistant';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  clearChat(): void {
    this.userMessage.set('');
    this.aiResponse.set('');
    this.hasResponse.set(false);
  }
}
