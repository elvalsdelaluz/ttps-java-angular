import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBillComponent } from './form-bill.component';

describe('FormBillComponent', () => {
  let component: FormBillComponent;
  let fixture: ComponentFixture<FormBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormBillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
