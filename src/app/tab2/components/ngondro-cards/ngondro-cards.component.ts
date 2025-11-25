import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { cardItemsData } from '../../config/cards-data.config';

@Component({
  selector: 'app-ngondro-cards',
  templateUrl: './ngondro-cards.component.html',
  styleUrls: ['./ngondro-cards.component.scss'],
})
export class NgondroCardsComponent  implements OnInit {

  cardInfo = cardItemsData;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.cardInfo, 'card information');

  }

  goToDetailsCounter(sectionId: string){
    console.log('goToDetailsCounter');
    this.router.navigate([`/tabs/tab2/counter/${sectionId}`]);
  }

}
