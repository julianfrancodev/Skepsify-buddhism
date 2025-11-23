import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { addIcons } from 'ionicons';
import { logoGoogle, personCircleOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, CommonModule, FormsModule, ButtonComponent]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) {
    addIcons({ personCircleOutline, logoGoogle });
  }

  ngOnInit() {
  }

  onLogin() {
    this.router.navigate(['/tabs']);
  }

  goToRegister() {
    this.router.navigate(['/onboarding/register']);
  }


}
