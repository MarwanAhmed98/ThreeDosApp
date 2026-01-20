import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouncilsService } from '../../../../core/services/councils/councils.service';
import { Icouncils } from '../../../interfaces/icouncils';
import { SearchcouncilsPipe } from '../../../pipes/searchcouncils/searchcouncils.pipe';
@Component({
  selector: 'app-councils',
  imports: [CommonModule, FormsModule , DatePipe , SearchcouncilsPipe],
  templateUrl: './councils.component.html',
  styleUrl: './councils.component.scss'
})
export class CouncilsComponent {
  private readonly councilsService = inject(CouncilsService);
  CouncilList: Icouncils[] = [];
  text: string = "";
  ngOnInit(): void {
    this.GetCouncils();
  }
  GetCouncils(): void {
    this.councilsService.GetCouncilList().subscribe({
      next: (res) => {
        console.log(res);
        this.CouncilList = res.data;
        console.log(this.CouncilList);
      }
    })
  }
}
