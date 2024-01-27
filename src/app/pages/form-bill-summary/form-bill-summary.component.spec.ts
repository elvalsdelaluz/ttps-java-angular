import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBillSummaryComponent } from './form-bill-summary.component';

describe('FormBillSummaryComponent', () => {
  let component: FormBillSummaryComponent;
  let fixture: ComponentFixture<FormBillSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormBillSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBillSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
