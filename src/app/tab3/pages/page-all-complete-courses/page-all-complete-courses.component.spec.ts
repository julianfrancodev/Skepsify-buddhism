import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageAllCompleteCoursesComponent } from './page-all-complete-courses.component';

describe('PageAllCompleteCoursesComponent', () => {
  let component: PageAllCompleteCoursesComponent;
  let fixture: ComponentFixture<PageAllCompleteCoursesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PageAllCompleteCoursesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageAllCompleteCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
