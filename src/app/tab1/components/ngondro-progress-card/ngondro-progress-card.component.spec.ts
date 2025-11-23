import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NgondroProgressCardComponent } from './ngondro-progress-card.component';

describe('NgondroProgressCardComponent', () => {
  let component: NgondroProgressCardComponent;
  let fixture: ComponentFixture<NgondroProgressCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgondroProgressCardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NgondroProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
