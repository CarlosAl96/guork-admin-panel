import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { User } from '../../../core/models/user';
import { ButtonModule } from 'primeng/button';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-history-user',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './history-user.component.html',
  styleUrl: './history-user.component.scss',
})
export class HistoryUserComponent {
  private userId: number = 0;
  public user!: User;
  constructor(
    public config: DynamicDialogConfig,
    public readonly refDialog: DynamicDialogRef,
    private readonly usersService: UsersService
  ) {
    this.userId = this.config.data;

    if (this.userId > 0) {
      this.getUserById(this.userId);
    }
  }

  private getUserById(userId: number): void {
    this.usersService.getUserById(userId).subscribe({
      next: (res) => {
        this.user = res.response;
        console.log(this.user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
