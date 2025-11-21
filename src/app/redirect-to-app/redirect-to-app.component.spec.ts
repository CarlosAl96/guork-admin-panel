import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectToAppComponent } from './redirect-to-app.component';

describe('RedirectToAppComponent', () => {
  let component: RedirectToAppComponent;
  let fixture: ComponentFixture<RedirectToAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectToAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectToAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
