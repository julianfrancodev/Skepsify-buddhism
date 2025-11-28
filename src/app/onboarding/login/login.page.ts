import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { addIcons } from 'ionicons';
import { logoGoogle, personCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule, ButtonComponent]
})
export class LoginPage {

  // Signals para el formulario
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
   * Login con Google
   */
  async loginWithGoogle() {
    try {
      this.isLoading.set(true);
      this.errorMessage.set('');
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      this.errorMessage.set(error.message);
      console.error('Error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Login con Email y Contraseña
   */
  async loginWithEmail() {
    const emailValue = this.email();
    const passwordValue = this.password();

    if (!emailValue || !passwordValue) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    try {
      this.isLoading.set(true);
      this.errorMessage.set('');
      await this.authService.signInWithEmail(emailValue, passwordValue);
    } catch (error: any) {
      this.errorMessage.set(error.message);
      console.error('Error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Navegar a registro
   */
  goToRegister() {
    this.router.navigate(['/onboarding/register']);
  }
}
