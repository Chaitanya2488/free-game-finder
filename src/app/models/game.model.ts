// Interface for the game list item from /api/games
export interface Game {
  id: number;
  title: string;
  thumbnail: string; // URL to thumbnail image
  short_description: string;
  game_url: string;
  genre: string;
  platform: string; // e.g., "PC (Windows)", "Web Browser"
  publisher: string;
  developer: string;
  release_date: string; // e.g., "2024-07-18"
  freetogame_profile_url: string;
}

// Interface for the detailed game data from /api/game?id=...
export interface GameDetails extends Game { // Extends the basic Game interface
  description: string;
  minimum_system_requirements?: MinimumSystemRequirements; // Optional property
  screenshots: Screenshot[]; // Array of screenshot objects
  status: string; // e.g., "Live"
}

export interface MinimumSystemRequirements {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

export interface Screenshot {
  id: number;
  image: string; // URL to screenshot image
}

// Interface for API query parameters (optional but helpful)
export interface GameQueryOptions {
  platform?: 'pc' | 'browser' | 'all';
  category?: string; // Genre, tag, etc.
  'sort-by'?: 'release-date' | 'popularity' | 'alphabetical' | 'relevance';
}