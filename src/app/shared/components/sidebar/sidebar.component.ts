import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { SidebarService } from '../../../core/services/sidebar.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public showSidebar: boolean = true;
  public user!: User | undefined;

  constructor(
    private readonly sessionService: SessionService,
    private readonly sidebarService: SidebarService
  ) {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
    this.sidebarService.getShowSidebar().subscribe((res) => {
      this.showSidebar = res;
    });
  }

  public changeStatusSidebar(value: boolean) {
    this.sidebarService.setShowSidebar(value);
  }

  public logout(): void {
    this.sessionService.deleteSession();
  }
}
