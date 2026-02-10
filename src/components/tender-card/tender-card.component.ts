
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
        <!-- Card Header -->
        <div class="flex justify-between items-start mb-3">
          <div class="flex gap-2 items-center">
            <span 
              class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border"
              [class.text-emerald-400]="tender().status === 'Abierta'"
              [class.border-emerald-900]="tender().status === 'Abierta'"
              [class.bg-emerald-950]="tender().status === 'Abierta'"
              [class.text-rose-400]="tender().status === 'Cerrada'"
              [class.border-rose-900]="tender().status === 'Cerrada'"
              [class.bg-rose-950]="tender().status === 'Cerrada'"
            >
              {{ tender().status }}
            </span>
            
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-zinc-800 bg-zinc-900 text-zinc-400">
              ID: {{ tender().codigoExterno }}
            </span>
          </div>
          
          <!-- Stars / Score -->
          <div class="flex text-amber-500 gap-0.5 text-xs">
            @for (star of [1,2,3]; track star) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
          {{ tender().title }}
        </h3>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm text-zinc-400 mb-6">
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            <span class="truncate">{{ tender().organization }}</span>
          </div>
          
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            @if (tender().amount === 0.0 && tender().montoDisplay) {
              <span class="text-emerald-400 font-medium">{{ tender().montoDisplay }}</span>
            } @else if (tender().amount > 0) {
              <span class="text-emerald-400 font-medium">{{ tender().amount | currency:tender().currency:'symbol':'1.0-0' }}</span>
            } @else {
              <span class="text-zinc-500">No disponible</span>
            }
          </div>

          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>Publicación: <span class="text-white">{{ tender().publishDate | date:'dd/MM/yyyy' }}</span></span>
          </div>

          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            @if (tender().closingDate) {
              <span>Cierre: <span class="text-white">{{ tender().closingDate | date:'dd/MM/yyyy' }}</span></span>
            } @else {
              <span class="text-zinc-500">Cierre: No disponible</span>
            }
          </div>
        </div>

        <!-- Action Footer -->
        <div class="pt-4 border-t border-zinc-900 flex justify-between items-center">
           <div class="flex items-center gap-2 text-xs">
             <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span class="text-zinc-500">Probabilidad alta</span>
           </div>

           <a 
             [href]="mercadoPublicoUrl()" 
             target="_blank" 
             rel="noopener noreferrer"
             class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 hover:underline transition-colors"
           >
             Ver en Ficha Original
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
