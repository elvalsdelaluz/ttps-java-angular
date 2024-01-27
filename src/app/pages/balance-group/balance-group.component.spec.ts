import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceGroupComponent } from './balance-group.component';

describe('BalanceGroupComponent', () => {
  let component: BalanceGroupComponent;
  let fixture: ComponentFixture<BalanceGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BalanceGroupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BalanceGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
