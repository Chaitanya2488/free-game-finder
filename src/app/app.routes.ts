import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameDetailComponent } from './pages/game-detail/game-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Free Game Finder - Home' // Set page title
  },
  {
    path: 'game/:id', // Route parameter for game ID
    component: GameDetailComponent,
    title: 'Free Game Finder - Details'
  },
  // Optional: Add more routes for filtering by genre page, etc.
  // {
  //   path: 'genre/:genreName',
  //   component: HomeComponent, // Reuse HomeComponent or create a GenrePageComponent
  //   title: 'Free Game Finder - Genre'
  // },
  {
    path: '**', // Wildcard route for 404
    component: NotFoundComponent,
    title: 'Free Game Finder - Not Found'
  }
];