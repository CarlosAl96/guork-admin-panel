import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public user!: User | undefined;

  constructor(private readonly sessionService: SessionService) {}

  ngOnInit(): void {
    this.user = this.sessionService.readSession('USER_TOKEN')?.user;
  }
}
