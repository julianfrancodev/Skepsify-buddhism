import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'app-ngondro-progress-card',
  templateUrl: './ngondro-progress-card.component.html',
  styleUrls: ['./ngondro-progress-card.component.scss'],
  imports: [ButtonComponent]
})
export class NgondroProgressCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
