import { Component, Input, Output, EventEmitter, OnInit, inject, signal, effect } from '@angular/core';
import { IonIcon } from "@ionic/angular/standalone";
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, calendarOutline, exitOutline, libraryOutline, timeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-sections-info-user',
  templateUrl: './sections-info-user.component.html',
  styleUrls: ['./sections-info-user.component.scss'],
  standalone: true,
  imports: [IonIcon, TranslateModule]
})
export class SectionsInfoUserComponent implements OnInit {

  @Input() iconName: string = '';
  @Input() title: string = '';
  @Input() translationKey: string = '';
  @Output() OnClickOpenScreen = new EventEmitter<void>();

  private translationService = inject(TranslationService);

  // Signal para el texto a mostrar
  displayText = signal<string>('');

  constructor() {
    addIcons({ arrowForwardOutline, timeOutline, calendarOutline, libraryOutline, exitOutline });

    // Effect para actualizar el texto cuando cambia el idioma
    effect(() => {
      // Observar el cambio de idioma
      const currentLang = this.translationService.currentLanguage();

      // Actualizar el texto
      const text = this.translationKey
        ? this.translationService.instant(this.translationKey)
        : this.title;

      this.displayText.set(text);
    });
  }

  ngOnInit() {
    // Inicializar el texto
    const text = this.translationKey
      ? this.translationService.instant(this.translationKey)
      : this.title;
    this.displayText.set(text);
  }

  handleClick() {
    this.OnClickOpenScreen.emit();
  }

}
