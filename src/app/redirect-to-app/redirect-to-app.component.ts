import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect-to-app',
  standalone: true,
  imports: [],
  templateUrl: './redirect-to-app.component.html',
  styleUrl: './redirect-to-app.component.scss',
})
export class RedirectToAppComponent implements OnInit {
  ngOnInit(): void {
    console.log('redirecting to the play store');
    window.location.href =
      'https://play.google.com/store/apps/details?id=com.myapp.applicaction_zuenio&pli=1';
  }
}
