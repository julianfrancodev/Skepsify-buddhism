import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailsCounterNgondroComponent } from './details-counter-ngondro.component';

describe('DetailsCounterNgondroComponent', () => {
  let component: DetailsCounterNgondroComponent;
  let fixture: ComponentFixture<DetailsCounterNgondroComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsCounterNgondroComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsCounterNgondroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
