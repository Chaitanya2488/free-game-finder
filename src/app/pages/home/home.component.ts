import { Component, OnInit, inject, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor, async pipe etc.
import { GameService } from '../../services/game.service';
import { Game, GameQueryOptions } from '../../models/game.model';
import { GameCardComponent } from '../../components/game-card/game-card.component'; // Import GameCard
import { LoaderComponent } from '../../components/loader/loader.component'; // Import Loader
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { Subject, Observable, of, debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GameCardComponent, LoaderComponent, FormsModule], // Include needed modules/components
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private gameService = inject(GameService);

  // Signals for reactive state management
  games: WritableSignal<Game[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);
  allGames: WritableSignal<Game[]> = signal([]); // Store the full list for client-side search

  // --- Filtering/Sorting State ---
  selectedGenre: WritableSignal<string> = signal(''); // e.g., 'shooter', 'moba'
  selectedSortBy: WritableSignal<string> = signal('relevance'); // e.g., 'popularity'
  searchTerm: WritableSignal<string> = signal('');

  // Available genres (can be hardcoded or fetched if API provides a list)
  genres: string[] = ['mmorpg', 'shooter', 'strategy', 'moba', 'racing', 'sports', 'social', 'sandbox', 'open-world', 'survival', 'pvp', 'pve', 'pixel', 'voxel', 'zombie', 'turn-based', 'first-person', 'third-person', 'top-down', 'tank', 'space', 'sailing', 'side-scroller', 'superhero', 'permadeath', 'card', 'battle-royale', 'mmo', 'mmofps', 'mmotps', '3d', '2d', 'anime', 'fantasy', 'sci-fi', 'fighting', 'action-rpg', 'action', 'military', 'martial-arts', 'flight', 'low-spec', 'tower-defense', 'horror', 'mmorts'];
  sortOptions: { value: string, label: string }[] = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'release-date', label: 'Release Date' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  // --- Client-side Search Logic ---
  // Use computed signal to filter games based on searchTerm
  filteredGames = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.games(); // No search term, return all fetched games
    }
    return this.games().filter(game =>
      game.title.toLowerCase().includes(term) ||
      game.genre.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.fetchGames(); // Fetch initial list on component load
  }

  fetchGames(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.games.set([]); // Clear previous games

    const options: GameQueryOptions = {};
    if (this.selectedGenre()) {
      options.category = this.selectedGenre();
    }
    if (this.selectedSortBy() && this.selectedSortBy() !== 'relevance') { // 'relevance' is often default
      options['sort-by'] = this.selectedSortBy() as GameQueryOptions['sort-by'];
    }
    // Platform filter could be added similarly

    this.gameService.getGames(options).subscribe({
      next: (data) => {
        this.games.set(data);
        // this.allGames.set(data); // Store for client-side filtering if needed, but fetchGames re-fetches based on filters now
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load games.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  // --- Event Handlers for Filters/Sort ---
  onGenreChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedGenre.set(target.value);
    this.fetchGames(); // Re-fetch games with new genre filter
  }

  onSortChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedSortBy.set(target.value);
    this.fetchGames(); // Re-fetch games with new sorting
  }

   onSearchTermChange(event: Event): void {
     const target = event.target as HTMLInputElement;
     this.searchTerm.set(target.value);
     // Client-side filtering happens reactively via the computed `filteredGames` signal
     // No need to call fetchGames() here unless you implement server-side search
   }

    trackGameById(index: number, game: Game): number {
    return game.id;
  }
}