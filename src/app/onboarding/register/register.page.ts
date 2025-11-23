import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from '../../components/button/button.component';
import { addIcons } from 'ionicons';
import { logoGoogle, personCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule, ButtonComponent]
})
export class RegisterPage implements OnInit {

  constructor(private router: Router) {
    addIcons({ personCircleOutline, logoGoogle });
  }

  ngOnInit() {
  }

  onRegister() {
    this.router.navigate(['/tabs']);
  }

  goToLogin() {

    this.router.navigate(['/onboarding/login']);

  }


}
