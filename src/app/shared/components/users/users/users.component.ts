import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users/users.service';
import { Iusers } from '../../../interfaces/iusers';
import { SearchuserPipe } from '../../../pipes/searchuser/searchuser.pipe';
@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, SearchuserPipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'

})
export class UsersComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  UsersList: Iusers[] = [];
  text: string = "";
  currentPage: number = 1;
  totalPages: number = 1;
  ngOnInit(): void {
    this.GetUsers();
  }
  GetUsers(): void {
    this.usersService.GetUserList(this.currentPage).subscribe({
      next: (res) => {
        this.UsersList = res.data.data;
        this.totalPages = res.data.last_page;
        this.currentPage = res.data.current_page;
        console.log(this.UsersList);
      }
    })
  }
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.GetUsers();
    }
  }
}
