import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Import ActivatedRoute and RouterLink
import { GameService } from '../../services/game.service';
import { GameDetails } from '../../models/game.model';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent], // Add RouterLink for back button
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);

  // Signal to hold game details or null
  gameDetails: WritableSignal<GameDetails | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Get the 'id' parameter from the URL and fetch details
    this.route.paramMap.pipe(
      tap(() => this.isLoading.set(true)), // Start loading when params change
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          // Convert id to number if your service expects a number
          return this.gameService.getGameDetails(+id).pipe(
            catchError(err => {
              this.error.set(err.message || 'Failed to load game details.');
              this.isLoading.set(false);
              console.error(err);
              return of(null); // Return null observable on error
            })
          );
        } else {
          this.error.set('Game ID not found in URL.');
          this.isLoading.set(false);
          return of(null); // Return null observable if no ID
        }
      })
    ).subscribe(details => {
      if (details) {
         this.gameDetails.set(details);
         this.error.set(null); // Clear error on success
      }
      // isLoading and error are set within the pipe now
      this.isLoading.set(false);
    });
  }
}