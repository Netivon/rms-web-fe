import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordTenanciesComponent } from './landlord-tenancies.component';

describe('LandlordTenanciesComponent', () => {
  let component: LandlordTenanciesComponent;
  let fixture: ComponentFixture<LandlordTenanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandlordTenanciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandlordTenanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
