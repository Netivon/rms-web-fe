import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesListComponent } from './properties-list.component';
import { provideRouter } from '@angular/router';

describe('PropertiesListComponent', () => {
  let component: PropertiesListComponent;
  let fixture: ComponentFixture<PropertiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesListComponent],
      providers: [
        provideRouter([]) 
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
