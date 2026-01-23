import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchteams',
  standalone: true
})
export class SearchteamsPipe implements PipeTransform {
  transform(value: any[], text: string): any[] {
    if (!value || !text) {
      return value;
    }
    return value.filter(item => 
      item.team_number?.toString().toLowerCase().includes(text.toLowerCase()) ||
      item.council_name?.toLowerCase().includes(text.toLowerCase())
    );
  }
}
