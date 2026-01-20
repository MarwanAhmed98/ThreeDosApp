import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchcouncils'
})
export class SearchcouncilsPipe implements PipeTransform {

  transform(arrOfObject: any[], klma: string): any[] {
    return arrOfObject.filter((item) => item.name.toLowerCase().includes(klma.toLowerCase()));
  }

}
