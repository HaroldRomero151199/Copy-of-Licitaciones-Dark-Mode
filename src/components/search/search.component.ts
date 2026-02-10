
import { Component, computed, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Tender, SearchResponse } from '../../models/tender.interface';
import { TenderService } from '../../services/tender.service';
import { TenderCardComponent } from '../tender-card/tender-card.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TenderCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private tenderService = inject(TenderService);

  // --- UI State Signals ---
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(false);
  hasSearched = signal<boolean>(false);
  
  // --- Data Signals ---
  tenders = signal<Tender[]>([]);
  
  // --- Pagination State (server-side) ---
  currentPage = signal<number>(1);
  pageSize = signal<number>(20); // Match backend default
  totalResults = signal<number>(0);
  totalPagesFromServer = signal<number>(0);

  // --- Computed Signals ---
  
  // Use server-provided total pages
  totalPages = computed(() => this.totalPagesFromServer());

  // Display all items from current page (no client-side pagination needed)
  paginatedResults = computed(() => this.tenders());

  // Metadata for display
  totalResultsCount = computed(() => this.totalResults());

  // --- Actions ---

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  performSearch() {
    const query = this.searchQuery().trim();
    if (!query) {
      // Don't search with empty query
      return;
    }

    this.isLoading.set(true);
    this.hasSearched.set(false);
    this.currentPage.set(1);

    this.loadPage(query, 1);
  }

  private loadPage(query: string, page: number) {
    this.tenderService.searchTenders(query, page, this.pageSize())
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response: SearchResponse) => {
          // Map API DTOs to Tender models
          const mappedTenders = response.items.map(dto => 
            this.tenderService.mapDtoToTender(dto)
          );
          
          this.tenders.set(mappedTenders);
          this.totalResults.set(response.total);
          this.totalPagesFromServer.set(response.totalPages);
          this.hasSearched.set(true);
        },
        error: (err) => {
          console.error('Error searching tenders:', err);
          this.tenders.set([]);
          this.totalResults.set(0);
          this.totalPagesFromServer.set(0);
          this.hasSearched.set(true);
        }
      });
  }

  nextPage() {
    const query = this.searchQuery().trim();
    if (query && this.currentPage() < this.totalPages()) {
      const nextPageNum = this.currentPage() + 1;
      this.currentPage.set(nextPageNum);
      this.isLoading.set(true);
      this.loadPage(query, nextPageNum);
      this.scrollToTop();
    }
  }

  prevPage() {
    const query = this.searchQuery().trim();
    if (query && this.currentPage() > 1) {
      const prevPageNum = this.currentPage() - 1;
      this.currentPage.set(prevPageNum);
      this.isLoading.set(true);
      this.loadPage(query, prevPageNum);
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    const resultsElement = document.getElementById('results-anchor');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
