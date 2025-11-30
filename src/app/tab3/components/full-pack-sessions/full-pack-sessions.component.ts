import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-full-pack-sessions',
  templateUrl: './full-pack-sessions.component.html',
  styleUrls: ['./full-pack-sessions.component.scss'],
})
export class FullPackSessionsComponent implements OnInit {

  router = inject(Router);

  constructor() { }

  ngOnInit() { }

  goToShowAllCourses() {
    this.router.navigate(['/tabs/tab3/all-complete-courses']);
  }

}
