
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tender, SearchResponse, TenderSummaryDTO } from '../models/tender.interface';

@Injectable({
  providedIn: 'root'
})
export class TenderService {
  private http = inject(HttpClient);
  // Direct connection to backend (backend must have CORS enabled)
  private readonly apiBaseUrl = 'http://localhost:8000';

  /**
   * Search tenders using the backend API.
   * @param query Search query string
   * @param page Page number (1-indexed)
   * @param size Page size (default: 20)
   * @returns Observable with SearchResponse containing pagination info and items
   */
  searchTenders(query: string, page: number = 1, size: number = 20): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('q', query.trim() || '')
      .set('page', page.toString())
      .set('size', size.toString());

    // Use text response and parse JSON manually to be robust to
    // backends that may not set Content-Type: application/json.
    return this.http
      .get(`${this.apiBaseUrl}/search`, { params, responseType: 'text' as const })
      .pipe(
        map((raw: string) => {
          try {
            return JSON.parse(raw) as SearchResponse;
          } catch (e) {
            console.error('Failed to parse /search response as JSON', e, raw);
            throw e;
          }
        })
      );
  }

  /**
   * Map API DTO to frontend Tender model.
   */
  mapDtoToTender(dto: TenderSummaryDTO): Tender {
    // Map API status to frontend status format
    const statusMap: Record<string, string> = {
      'open': 'Abierta',
      'closed': 'Cerrada',
      'deserted': 'Cerrada',
      'awarded': 'Adjudicada'
    };

    return {
      id: crypto.randomUUID(), // Generate internal UUID
      codigoExterno: dto.id,
      title: dto.title,
      organization: dto.entity,
      amount: dto.amount,
      currency: dto.currency,
      status: statusMap[dto.status] || dto.status,
      publishDate: dto.publishDate,
      closingDate: dto.closingDate || '',
      matchScore: dto.score,
      montoDisplay: dto.montoDisplay,
      url: dto.url
    };
  }

  /**
   * Search tenders and return mapped Tender array (for backward compatibility).
   * @deprecated Use searchTenders() directly for pagination support
   */
  searchTendersLegacy(query: string): Observable<Tender[]> {
    return this.searchTenders(query, 1, 100).pipe(
      map(response => response.items.map(dto => this.mapDtoToTender(dto)))
    );
  }
}
