import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordTenanciesComponent } from './landlord-tenancies.component';
import { provideRouter } from '@angular/router';

describe('LandlordTenanciesComponent', () => {
  let component: LandlordTenanciesComponent;
  let fixture: ComponentFixture<LandlordTenanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordTenanciesComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordTenanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
