import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'delegatesteams'
})
export class DelegatesteamsPipe implements PipeTransform {

  transform(arrOfObject: any[], klma: string): any[] {
    return arrOfObject.filter((item) => item.team_number.toLowerCase().includes(klma.toLowerCase()));
  }

}
