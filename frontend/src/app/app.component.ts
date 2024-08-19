import { Component } from '@angular/core';
import { AlertifyService } from './services/alertify.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'frontend';

  constructor(
    public alertifyService: AlertifyService){
   
  }

}
