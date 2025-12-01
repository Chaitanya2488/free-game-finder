import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Game, GameDetails, GameQueryOptions } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Directly call the FreeToGame API instead of /api proxy
  private readonly apiUrl = 'https://www.freetogame.com/api';
  private http = inject(HttpClient);

  /**
   * Fetch a list of games with optional filters/sorting.
   * Calls the FreeToGame API directly.
   */
  getGames(options?: GameQueryOptions): Observable<Game[]> {
    let params = new HttpParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    }

    return this.http.get<Game[]>(`${this.apiUrl}/games`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Fetch details for a single game by its ID.
   * Calls the FreeToGame API directly.
   */
  getGameDetails(id: number | string): Observable<GameDetails> {
    const params = new HttpParams().set('id', id.toString());

    return this.http.get<GameDetails>(`${this.apiUrl}/game`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Basic error handler for API requests.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred in GameService:', error);
    return throwError(() => new Error('Something went wrong fetching game data; please try again later.'));
  }
}