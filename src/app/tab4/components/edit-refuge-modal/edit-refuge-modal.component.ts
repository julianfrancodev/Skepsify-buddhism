import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonIcon,
    ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flowerOutline } from 'ionicons/icons';

@Component({
    selector: 'app-edit-refuge-modal',
    template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Nombre de Refugio</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()" color="medium">
            Cancelar
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="modal-content">
        <div class="dharma-icon">
          <ion-icon name="flower-outline"></ion-icon>
        </div>

        <div class="form-section">
          <ion-item lines="none">
            <ion-label position="stacked">Nombre de Refugio</ion-label>
            <ion-input
              [(ngModel)]="refugeName"
              placeholder="Ej: Karma Dorje"
              type="text"
            ></ion-input>
          </ion-item>

          <ion-item lines="none">
            <ion-label position="stacked">Significado (opcional)</ion-label>
            <ion-textarea
              [(ngModel)]="refugeMeaning"
              placeholder="Ej: Actividad Indestructible"
              rows="3"
            ></ion-textarea>
          </ion-item>
        </div>

        <ion-button
          expand="block"
          (click)="save()"
          [disabled]="!refugeName || refugeName.trim() === ''"
          class="save-button"
        >
          Guardar
        </ion-button>
      </div>
    </ion-content>
  `,
    styles: [`
    ion-toolbar {
      --background: #FFFFFF;
      --color: #5C504A;
    }

    ion-title {
      font-weight: 700;
      color: #5C504A;
    }

    .modal-content {
      max-width: 500px;
      margin: 0 auto;
    }

    .dharma-icon {
      text-align: center;
      margin: 20px 0 30px 0;

      ion-icon {
        font-size: 48px;
        color: #E0C99A;
      }
    }

    .form-section {
      margin-bottom: 24px;
    }

    ion-item {
      --background: transparent;
      margin-bottom: 20px;
      --padding-start: 0;
      --inner-padding-end: 0;
    }

    ion-label {
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #B8B0AB;
      margin-bottom: 8px;
    }

    ion-input, ion-textarea {
      --background: #FFFFFF;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 12px;
      --padding-bottom: 12px;
      border-radius: 12px;
      border: 1px solid rgba(224, 201, 154, 0.3);
      margin-top: 8px;
      font-size: 16px;
      color: #5C504A;
    }

    ion-input::part(native)::placeholder,
    ion-textarea::part(native)::placeholder {
      color: #B8B0AB;
      opacity: 0.6;
    }

    ion-textarea {
      --padding-top: 12px;
      min-height: 80px;
    }

    .save-button {
      --background: #D79A8B;
      --background-activated: #c78a7b;
      --border-radius: 12px;
      --box-shadow: 0px 4px 12px rgba(215, 154, 139, 0.3);
      height: 50px;
      font-weight: 700;
      font-size: 16px;
      margin-top: 10px;
    }

    .save-button::part(native):disabled {
      opacity: 0.5;
    }
  `],
    standalone: true,
    imports: [
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonContent,
        IonItem,
        IonLabel,
        IonInput,
        IonTextarea,
        IonIcon,
        FormsModule
    ]
})
export class EditRefugeModalComponent {
    private modalCtrl = inject(ModalController);

    @Input() refugeName: string = '';
    @Input() refugeMeaning: string = '';

    constructor() {
        addIcons({ flowerOutline });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    save() {
        this.modalCtrl.dismiss({
            refugeName: this.refugeName.trim(),
            refugeMeaning: this.refugeMeaning.trim()
        });
    }
}
