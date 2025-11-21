import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DniViewComponent } from './dni-view.component';

describe('DniViewComponent', () => {
  let component: DniViewComponent;
  let fixture: ComponentFixture<DniViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DniViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DniViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
