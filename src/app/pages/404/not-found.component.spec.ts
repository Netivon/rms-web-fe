import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found.component';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    // 1. Create a Spy for the Location service
    // We only need to spy on the 'back' method used in the component
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [
        NotFoundComponent, // Import the standalone component
        RouterTestingModule // Needed for routerLink directive to work without errors
      ],
      providers: [
        // 2. Provide the Spy instead of the real Location service
        { provide: Location, useValue: locationSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the 404 title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const h1 = compiled.querySelector('h1');
    const h2 = compiled.querySelector('h2');
    
    expect(h1?.textContent).toContain('404');
    expect(h2?.textContent).toContain('Page Not Found');
  });

  it('should call location.back() when "Go Back" button is clicked', () => {
    // Find the button by its text or css class
    // Here we find the first button (which is "Go Back")
    const backButton = fixture.debugElement.query(By.css('button'));
    
    // Simulate a click event
    backButton.triggerEventHandler('click', null);

    // Verify the spy was called
    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should have a link pointing to the home page', () => {
    // Find the anchor tag with the specific routerLink
    const homeLink = fixture.debugElement.query(By.css('a[routerLink="/"]'));
    
    expect(homeLink).toBeTruthy();
    expect(homeLink.nativeElement.textContent).toContain('Go Home');
  });
});