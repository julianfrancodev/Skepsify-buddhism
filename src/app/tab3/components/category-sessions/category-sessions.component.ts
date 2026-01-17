import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../core/services/firestore.service';
import { CategoryWithCount } from '../../../core/models/models';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-category-sessions',
  templateUrl: './category-sessions.component.html',
  styleUrls: ['./category-sessions.component.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner]
})
export class CategorySessionsComponent implements OnInit {

  private firestoreService = inject(FirestoreService);
  private router = inject(Router);

  categories = signal<CategoryWithCount[]>([]);
  loading = signal<boolean>(true);

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading.set(true);
    const randomCategories = await this.firestoreService.getRandomCategories(4);
    this.categories.set(randomCategories);
    this.loading.set(false);
  }

  goToCategoryCourses(category: CategoryWithCount) {
    this.router.navigate(['/tabs/tab3/all-courses-by-category', category.id]);
  }

}
