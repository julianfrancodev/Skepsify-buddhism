import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { SlideComponent } from './components/slide/slide.component';
import { SwiperContainer } from 'swiper/element';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, SlideComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class WelcomePage implements OnInit {
  @ViewChild('swiper')
  swiper!: ElementRef<SwiperContainer>;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextSlide() {
    this.swiper.nativeElement.swiper.slideNext();
  }

  startApp() {
    this.router.navigate(['/onboarding/login']);
  }
}
