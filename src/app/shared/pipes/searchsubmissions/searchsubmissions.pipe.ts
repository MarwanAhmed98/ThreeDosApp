import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchsubmissions',
  standalone: true
})
export class SearchsubmissionsPipe implements PipeTransform {
  transform(value: any[], text: string): any[] {
    if (!value || !text) {
      return value;
    }
    return value.filter(item => 
      item.task_title?.toLowerCase().includes(text.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(text.toLowerCase())
    );
  }
}
