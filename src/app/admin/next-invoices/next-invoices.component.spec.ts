import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextInvoicesComponent } from './next-invoices.component';

describe('NextInvoicesComponent', () => {
  let component: NextInvoicesComponent;
  let fixture: ComponentFixture<NextInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextInvoicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
