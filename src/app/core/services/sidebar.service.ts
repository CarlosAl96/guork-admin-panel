import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private showSidebar$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {}

  setShowSidebar(value: boolean) {
    this.showSidebar$.next(value);
  }

  getShowSidebar(): Observable<boolean> {
    return this.showSidebar$;
  }
}
