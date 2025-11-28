import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from '../../components/button/button.component';
import { addIcons } from 'ionicons';
import { logoGoogle, personCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule, ButtonComponent]
})
export class RegisterPage {

  // Signals para el formulario
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ personCircleOutline, logoGoogle });
  }

  /**
   * Registro con Google
   */
  async registerWithGoogle() {
    try {
      this.isLoading.set(true);
      this.errorMessage.set('');
      await this.authService.signInWithGoogle();
      // La navegación se maneja en el servicio
    } catch (error: any) {
      this.errorMessage.set(error.message);
      console.error('Error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Registro con Email y Contraseña
   */
  async registerWithEmail() {
    const nameValue = this.name();
    const emailValue = this.email();
    const passwordValue = this.password();

    // Validaciones
    if (!nameValue || !emailValue || !passwordValue) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (passwordValue.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      this.isLoading.set(true);
      this.errorMessage.set('');

      // Crear usuario con email, password y nombre
      await this.authService.signUpWithEmail(emailValue, passwordValue, nameValue);

      // La navegación se maneja en el servicio
    } catch (error: any) {
      this.errorMessage.set(error.message);
      console.error('Error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Navegar a login
   */
  goToLogin() {
    this.router.navigate(['/onboarding/login']);
  }
}
