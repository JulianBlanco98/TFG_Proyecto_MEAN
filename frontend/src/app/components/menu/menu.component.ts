import { Component } from '@angular/core';
import { faHome, faMoneyCheckDollar, faTrophy, faBook, faGift } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  /*constructor(private readonly modalService: ngb){

  }*/


  faHome = faHome;
  faMoney = faMoneyCheckDollar;
  faTrophy = faTrophy;
  faBook = faBook;
  faGift = faGift;

  regiterModal(){
    
  }
}
