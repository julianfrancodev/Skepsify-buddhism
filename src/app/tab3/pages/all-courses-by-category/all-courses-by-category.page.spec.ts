import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllCoursesByCategoryPage } from './all-courses-by-category.page';

describe('AllCoursesByCategoryPage', () => {
  let component: AllCoursesByCategoryPage;
  let fixture: ComponentFixture<AllCoursesByCategoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCoursesByCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
