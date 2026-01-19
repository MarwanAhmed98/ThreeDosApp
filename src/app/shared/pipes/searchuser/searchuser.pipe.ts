import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchuser'
})
export class SearchuserPipe implements PipeTransform {

  transform(arrOfObject: any[], klma: string): any[] {
    return arrOfObject.filter((item) => item.name.toLowerCase().includes(klma.toLowerCase())  || item.email.toLowerCase().includes(klma.toLowerCase()));
  }

}
