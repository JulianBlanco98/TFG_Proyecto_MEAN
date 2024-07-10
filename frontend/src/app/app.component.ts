import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserComponent } from "./user/user.component";
import { GamesComponent } from "./games/games.component";

@Component({
  selector: 'app-root',
  standalone: true, //Importar un componente aqui, se pone en imports
  imports: [RouterOutlet, CommonModule, UserComponent, GamesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // title = 'frontend';
  city = 'Badajoz';
}
