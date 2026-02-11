
import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Tender } from '../../models/tender.interface';

@Component({
  selector: 'app-tender-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative bg-[#0a0a0a] border border-zinc-800 rounded-lg p-5 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      
      <!-- Hover Gradient Border Simulation -->
      <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-900/0 via-emerald-900/10 to-emerald-900/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></div>

      <div class="relative z-10">
      <div class="relative z-10 h-full flex flex-col">
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex flex-wrap gap-2 items-center">
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
              [class.text-emerald-400]="tender().status === 'Abierta'"
              [class.border-emerald-900]="tender().status === 'Abierta'"
              [class.bg-emerald-950]="tender().status === 'Abierta'"
              [class.text-rose-400]="tender().status === 'Cerrada'"
              [class.border-rose-900]="tender().status === 'Cerrada'"
              [class.bg-rose-950]="tender().status === 'Cerrada'"
              [class.text-amber-400]="tender().status === 'Adjudicada'"
              [class.border-amber-900]="tender().status === 'Adjudicada'"
              [class.bg-amber-950]="tender().status === 'Adjudicada'"
            >
              {{ tender().status }}
            </span>
            
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-800 bg-zinc-900 text-zinc-400">
              ID: {{ tender().codigoExterno }}
            </span>

            @if (tender().type) {
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-900 bg-blue-950 text-blue-400">
                {{ tender().type }}
              </span>
            }
          </div>
          
          <!-- Solr Score -->
          @if (tender().matchScore) {
            <div class="flex items-center gap-1 text-xs text-amber-500" title="Relevancia de búsqueda">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="font-mono">{{ tender().matchScore | number:'1.1-1' }}</span>
            </div>
          }
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors line-clamp-2" [title]="tender().title">
          {{ tender().title }}
        </h3>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-zinc-400 mb-4 flex-grow">
          <div class="flex items-start gap-2 col-span-1 md:col-span-2">
            <svg class="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span class="line-clamp-1" [title]="tender().organization">{{ tender().organization }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            @if (tender().amount === 0.0 && tender().montoDisplay) {
              <span class="text-emerald-400 font-medium whitespace-nowrap">{{ tender().montoDisplay }}</span>
            } @else if (tender().amount > 0) {
              <span class="text-emerald-400 font-medium whitespace-nowrap">{{ tender().amount | currency:tender().currency:'symbol':'1.0-0' }}</span>
            } @else {
              <span class="text-zinc-500">Monto no especificado</span>
            }
          </div>

          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span class="truncate">
              {{ tender().comuna || 'Comuna no especificada' }}
              @if (tender().region && tender().region !== tender().comuna) {
                , {{ tender().region }}
              }
            </span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span class="truncate">Pub: <span class="text-white">{{ tender().publishDate | date:'dd/MM/yyyy' }}</span></span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            @if (tender().closingDate) {
              <span class="truncate">Cierre: <span class="text-white">{{ tender().closingDate | date:'dd/MM/yyyy' }}</span></span>
            } @else {
              <span class="text-zinc-500 truncate">Cierre: No disponible</span>
            }
          </div>
        </div>

        <!-- Description (Truncated) -->
        @if (tender().description) {
          <p class="text-xs text-zinc-500 mb-4 line-clamp-3 leading-relaxed">
            {{ tender().description }}
          </p>
        }

        <!-- Action Footer -->
        <div class="pt-4 border-t border-zinc-900 flex justify-between items-center mt-auto">
           <div class="flex items-center gap-2 text-xs">
             @if (tender().complaintsLevel === 'alto') {
               <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
               <span class="text-rose-400">Riesgo Alto ({{ tender().complaintsCount }} reclamos)</span>
             } @else if (tender().complaintsLevel === 'medio') {
               <span class="w-2 h-2 rounded-full bg-amber-500"></span>
               <span class="text-amber-400">Riesgo Medio</span>
             } @else {
               <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
               <span class="text-zinc-500">Sin reclamos significativos</span>
             }
           </div>

           <a 
             [href]="mercadoPublicoUrl()" 
             target="_blank" 
             rel="noopener noreferrer"
             class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 hover:underline transition-colors ml-4"
           >
             Ver Ficha
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
           </a>
        </div>

      </div>
    </div>
  `
})
export class TenderCardComponent {
  tender = input.required<Tender>();

  // Computed signal for the URL (use API URL if available, otherwise construct it)
  mercadoPublicoUrl = computed(() => {
    if (this.tender().url) {
      return this.tender().url;
    }
    // Fallback: construct URL manually if API didn't provide it
    return `https://www.mercadopublico.cl/Procurement/Modules/RFB/DetailsAcquisition.aspx?idlicitacion=${this.tender().codigoExterno}`;
  });
}
