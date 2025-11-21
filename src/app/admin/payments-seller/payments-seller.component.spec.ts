import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsSellerComponent } from './payments-seller.component';

describe('PaymentsSellerComponent', () => {
  let component: PaymentsSellerComponent;
  let fixture: ComponentFixture<PaymentsSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
