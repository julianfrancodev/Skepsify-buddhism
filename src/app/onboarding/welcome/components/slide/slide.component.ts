import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from 'src/app/components/button/button.component';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.scss'],
  standalone: true,
  imports: [ButtonComponent],
})
export class SlideComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText?: string;

  @Output() buttonClick = new EventEmitter<void>();

  constructor() {}

}
