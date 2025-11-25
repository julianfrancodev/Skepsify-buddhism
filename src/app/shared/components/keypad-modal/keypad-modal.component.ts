import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, backspaceOutline } from 'ionicons/icons';

@Component({
    selector: 'app-keypad-modal',
    templateUrl: './keypad-modal.component.html',
    styleUrls: ['./keypad-modal.component.scss'],
    standalone: true,
    imports: [CommonModule, IonIcon]
})
export class KeypadModalComponent {
    displayValue = signal<string>('');

    constructor(private modalController: ModalController) {
        addIcons({ closeOutline, backspaceOutline });
    }

    addDigit(digit: number) {
        const current = this.displayValue();
        // Limitar a 6 dígitos
        if (current.length < 6) {
            this.displayValue.set(current + digit.toString());
        }
    }

    backspace() {
        const current = this.displayValue();
        this.displayValue.set(current.slice(0, -1));
    }

    clear() {
        this.displayValue.set('');
    }

    dismiss() {
        this.modalController.dismiss();
    }

    confirm() {
        const value = parseInt(this.displayValue() || '0', 10);
        this.modalController.dismiss({ value });
    }
}
