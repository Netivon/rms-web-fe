import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordPaymentsComponent } from './landlord-payments.component';
import { provideRouter } from '@angular/router';

describe('LandlordPaymentsComponent', () => {
  let component: LandlordPaymentsComponent;
  let fixture: ComponentFixture<LandlordPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordPaymentsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
