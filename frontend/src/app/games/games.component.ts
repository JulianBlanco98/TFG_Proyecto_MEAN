import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './games.component.html',
  styleUrl: './games.component.css'
})
export class GamesComponent {
  games = [
    {
      id: 1,
      name: 'Zelda',
    },
    {
      id: 2,
      name: 'Formula 1',
    },
    {
      id: 3,
      name: 'League of Legends',
    }
  ]
}
