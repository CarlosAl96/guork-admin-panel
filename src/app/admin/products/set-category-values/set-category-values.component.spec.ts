import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCategoryValuesComponent } from './set-category-values.component';

describe('SetCategoryValuesComponent', () => {
  let component: SetCategoryValuesComponent;
  let fixture: ComponentFixture<SetCategoryValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetCategoryValuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetCategoryValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
