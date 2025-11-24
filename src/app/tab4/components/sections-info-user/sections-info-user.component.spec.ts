import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SectionsInfoUserComponent } from './sections-info-user.component';

describe('SectionsInfoUserComponent', () => {
  let component: SectionsInfoUserComponent;
  let fixture: ComponentFixture<SectionsInfoUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SectionsInfoUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SectionsInfoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
