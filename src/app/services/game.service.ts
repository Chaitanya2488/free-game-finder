import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Game, GameDetails, GameQueryOptions } from '../models/game.model';

@Injectable({
  providedIn: 'root' // Available application-wide
})
export class GameService {
  private readonly apiUrl = '/api'; // Use HTTPS proxy if needed for CORS
  private http = inject(HttpClient); // Modern dependency injection

  // Fetch a list of games with optional filters/sorting
  getGames(options?: GameQueryOptions): Observable<Game[]> {
    let params = new HttpParams();
    if (options) {
      // Build query parameters dynamically
      Object.entries(options).forEach(([key, value]) => {
        if (value) { // Only add parameter if value is provided
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<Game[]>(`${this.apiUrl}/games`, { params }).pipe(
      catchError(this.handleError) // Basic error handling
    );
  }

  // Fetch details for a single game by its ID
  getGameDetails(id: number | string): Observable<GameDetails> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<GameDetails>(`${this.apiUrl}/game`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Basic error handler
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    // Return an observable that emits an error
    return throwError(() => new Error('Something went wrong fetching game data; please try again later.'));
  }
}