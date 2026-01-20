import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchsessions'
})
export class SearchsessionsPipe implements PipeTransform {

  transform(arrOfObject: any[], klma: string): any[] {
    return arrOfObject.filter((item) => item.title.toLowerCase().includes(klma.toLowerCase())  || item.council.toLowerCase().includes(klma.toLowerCase()));
  }

}
