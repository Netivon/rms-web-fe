import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenanciesComponent } from './tenancies.component';

describe('TenanciesComponent', () => {
  let component: TenanciesComponent;
  let fixture: ComponentFixture<TenanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenanciesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
