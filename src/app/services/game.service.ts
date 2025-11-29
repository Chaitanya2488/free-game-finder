import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Game, GameDetails, GameQueryOptions } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Use the relative path to our Vercel serverless proxy functions
  private readonly apiUrl = '/api';
  private http = inject(HttpClient);

  /**
   * Fetch a list of games with optional filters/sorting.
   * This now calls our own /api/games endpoint.
   */
  getGames(options?: GameQueryOptions): Observable<Game[]> {
    let params = new HttpParams();
    if (options) {
      // Build query parameters dynamically
      Object.entries(options).forEach(([key, value]) => {
        if (value) { // Only add parameter if a value is provided
          params = params.set(key, value);
        }
      });
    }

    // The request now goes to /api/games which Vercel will handle
    return this.http.get<Game[]>(`${this.apiUrl}/games`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetch details for a single game by its ID.
   * This now calls our own /api/game endpoint.
   */
  getGameDetails(id: number | string): Observable<GameDetails> {
    const params = new HttpParams().set('id', id.toString());

    // The request now goes to /api/game which Vercel will handle
    return this.http.get<GameDetails>(`${this.apiUrl}/game`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Basic error handler for API requests.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred in GameService:', error);
    // This message is what the user will see in the UI
    return throwError(() => new Error('Something went wrong fetching game data; please try again later.'));
  }
}