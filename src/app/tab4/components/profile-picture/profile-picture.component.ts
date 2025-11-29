import { Component, computed, inject } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
  imports: [IonIcon, CommonModule]
})
export class ProfilePictureComponent {


  authService = inject(AuthService);

  constructor() {
    addIcons({ personCircleOutline })
  }

  // Computed para obtener información del usuario
  userDisplayName = computed(() => {
    const user = this.authService.currentUser();
    return user?.displayName || user?.email?.split('@')[0] || 'Usuario';
  });

  userEmail = computed(() => {
    const user = this.authService.currentUser();
    return user?.email || '';
  });

  userPhotoURL = computed(() => {
    const user = this.authService.currentUser();
    return user?.photoURL || null;
  });

  // Año de registro
  userSince = computed(() => {
    const user = this.authService.currentUser();
    if (user?.metadata?.creationTime) {
      const year = new Date(user.metadata.creationTime).getFullYear();
      return year;
    }
    return new Date().getFullYear();
  });



}
