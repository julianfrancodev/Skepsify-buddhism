import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { hourglassOutline } from 'ionicons/icons';

@Component({
  selector: 'app-free-basic-timer',
  templateUrl: './free-basic-timer.component.html',
  styleUrls: ['./free-basic-timer.component.scss'],
  imports: [IonIcon]
})
export class FreeBasicTimerComponent implements OnInit {

  constructor(private router: Router) {
    addIcons({ hourglassOutline })
  }

  ngOnInit() { }

  goToBasicTimerPage() {
    this.router.navigate(['tabs/tab3/basic-timer'])
  }

}
