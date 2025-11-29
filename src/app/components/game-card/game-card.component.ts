import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game.model';
import { RouterLink } from '@angular/router'; // Import RouterLink

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink], // Add RouterLink here
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize performance
})
export class GameCardComponent {
  // Receive game data from parent component (HomeComponent)
  @Input({ required: true }) game!: Game;
}