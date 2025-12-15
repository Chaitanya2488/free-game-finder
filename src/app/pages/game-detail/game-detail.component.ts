import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReviewsService } from '../../services/reviews.service';
import { Review } from '../../models/review.model';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-review-detail',
  templateUrl: './review-detail.component.html',
  styleUrls: ['./review-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class ReviewDetailComponent implements OnInit, OnDestroy {
  review: Review | null = null;
  isLoading = false;
  reviewId: number;
  canEditReview = false;

  // store current user info here for synchronous checks
  private currentUserId?: string;
  private currentUserRoles: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private reviewsService: ReviewsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // read id from snapshot (safe in constructor)
    this.reviewId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // subscribe to currentUser once and keep it updated
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUserId = user?.id;
        this.currentUserRoles = Array.isArray(user?.roles) ? user.roles : (user?.roles ? [user.roles] : []);
        // if review already loaded, recompute permission
        if (this.review) {
          this.updateCanEditFlag();
        }
      });

    // Load the review
    this.loadReview();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Public helper used by template if needed
  public userCanEdit(): boolean {
    return this.canEditReview;
  }

  private updateCanEditFlag(): void {
    if (!this.review) {
      this.canEditReview = false;
      return;
    }

    // allow if owner or if user has Admin role
    const isOwner = !!(this.currentUserId && this.review.userId && this.currentUserId === this.review.userId);
    const isAdmin = this.currentUserRoles.includes('Admin');

    this.canEditReview = isOwner || isAdmin;
  }

  private loadReview(): void {
    if (!this.reviewId || isNaN(this.reviewId)) {
      this.snackBar.open('Invalid review id', 'Close', { duration: 3000 });
      this.router.navigate(['/reviews']);
      return;
    }

    this.isLoading = true;
    this.reviewsService.getReview(this.reviewId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (review: Review) => {
          this.review = review;
          this.isLoading = false;
          this.updateCanEditFlag();
        },
        error: (error: any) => {
          console.error('Error loading review:', error);
          this.isLoading = false;
          this.snackBar.open('Error loading review', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/reviews']);
        }
      });
  }

  onDelete(): void {
    if (!this.review || !this.review.id) return;

    if (!confirm('Are you sure you want to delete this review?')) return;

    this.reviewsService.deleteReview(this.review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Review deleted successfully', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/reviews']);
        },
        error: (error: any) => {
          console.error('Error deleting review:', error);
          const msg = (error?.error && error.error.message) ? error.error.message : 'Error deleting review';
          this.snackBar.open(msg, 'Close', {
            duration: 3000
          });
        }
      });
  }

  onEdit(): void {
    if (!this.review) return;
    this.router.navigate(['/reviews', this.review.id, 'edit']);
  }

  onBack(): void {
    this.router.navigate(['/reviews']);
  }
}