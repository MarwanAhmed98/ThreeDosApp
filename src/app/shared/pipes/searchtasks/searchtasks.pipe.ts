import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchtasks'
})
export class SearchtasksPipe implements PipeTransform {

  transform(arrOfObject: any[], klma: string): any[] {
    return arrOfObject.filter((item) => item.title.toLowerCase().includes(klma.toLowerCase()));
  }

}
