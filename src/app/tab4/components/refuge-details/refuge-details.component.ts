import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flower, flowerOutline, pencilOutline } from 'ionicons/icons';
import { StateService } from '../../../core/services/state.service';
import { EditRefugeModalComponent } from '../edit-refuge-modal/edit-refuge-modal.component';

@Component({
  selector: 'app-refuge-details',
  templateUrl: './refuge-details.component.html',
  styleUrls: ['./refuge-details.component.scss'],
  imports: [IonIcon, CommonModule]
})
export class RefugeDetailsComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  protected stateService = inject(StateService);

  constructor() {
    addIcons({ pencilOutline, flowerOutline })
  }

  ngOnInit() { }

  async openEditModal() {
    const user = this.stateService.user();

    const modal = await this.modalCtrl.create({
      component: EditRefugeModalComponent,
      componentProps: {
        refugeName: user?.refugeName || '',
        refugeMeaning: user?.refugeMeaning || ''
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      // Actualizar el usuario con los nuevos datos
      const currentUser = this.stateService.user();
      if (currentUser) {
        await this.stateService.updateUser({
          ...currentUser,
          refugeName: data.refugeName,
          refugeMeaning: data.refugeMeaning
        });
      }
    }
  }
}
