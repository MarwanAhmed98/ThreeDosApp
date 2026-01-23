import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchattendance',
  standalone: true
})
export class SearchattendancePipe implements PipeTransform {
  transform(value: any[], text: string): any[] {
    if (!value || !text) {
      return value;
    }
    return value.filter(item => 
      item.student?.toLowerCase().includes(text.toLowerCase()) ||
      item.session?.toLowerCase().includes(text.toLowerCase()) ||
      item.status?.toLowerCase().includes(text.toLowerCase())
    );
  }
}
