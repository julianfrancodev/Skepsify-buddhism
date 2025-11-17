import { Component, OnInit } from '@angular/core';
import {IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class OnboardingPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
