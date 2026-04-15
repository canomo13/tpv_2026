import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService, BusinessSettings } from '../../../services/settings.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticket-container bg-white p-6 shadow-2xl font-mono text-slate-900 border-2 border-slate-100 rounded-3xl animate-slide-up no-print-shadow">
      
      <!-- HEADER: LOGO & DATOS FISCALES -->
      <div class="text-center space-y-3 mb-6">
        <div *ngIf="settings()?.logoSvg" [innerHTML]="settings()?.logoSvg" class="w-16 h-16 mx-auto mb-2 opacity-80 overflow-hidden"></div>
        <h1 class="text-xl font-black italic tracking-tighter uppercase">{{ settings()?.name }}</h1>
        <div class="text-[10px] font-bold text-slate-500 flex flex-col uppercase tracking-wider">
           <span>{{ settings()?.companyName }}</span>
           <span>CIF: {{ settings()?.cif }}</span>
           <span>{{ settings()?.address }}</span>
           <span>Tel: {{ settings()?.phone }}</span>
        </div>
      </div>

      <div class="border-t border-dashed border-slate-200 my-4"></div>

      <!-- TICKET INFO -->
      <div class="flex flex-col gap-1 text-[11px] font-bold text-slate-600 mb-6 uppercase tracking-widest">
        <div class="flex justify-between">
          <span>Ticket:</span>
          <span class="text-slate-900">#{{ ticketData?.ticketNumber || 'PENDIENTE' }}</span>
        </div>
        <div class="flex justify-between">
          <span>Fecha:</span>
          <span>{{ ticketData?.createdAt | date:'dd/MM/yyyy' }}</span>
        </div>
        <div class="flex justify-between">
          <span>Camarero:</span>
          <span class="text-indigo-600">{{ ticketData?.user?.name }}</span>
        </div>
        <div class="flex justify-between">
          <span>Mesa:</span>
          <span>{{ ticketData?.table?.number }}</span>
        </div>
      </div>

      <!-- TIMES -->
      <div class="bg-slate-50 p-3 rounded-xl flex justify-around text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6">
         <div class="flex flex-col items-center">
            <span>Atención</span>
            <span class="text-slate-800">{{ ticketData?.createdAt | date:'HH:mm' }}</span>
         </div>
         <div class="w-px h-6 bg-slate-200"></div>
         <div class="flex flex-col items-center">
            <span>Cobro</span>
            <span class="text-slate-800">{{ ticketData?.paidAt | date:'HH:mm' }}</span>
         </div>
      </div>

      <div class="border-t border-slate-100 my-4"></div>

      <!-- ITEMS -->
      <div class="space-y-2 mb-8">
        <div *ngFor="let item of ticketData?.items" class="flex justify-between items-start text-xs font-bold leading-tight">
          <div class="flex flex-col max-w-[70%]">
             <span class="text-slate-900">{{ item.product.name }}</span>
             <span class="text-[10px] text-slate-400">x{{ item.quantity }} · {{ item.price | currency:'EUR' }}</span>
          </div>
          <span class="text-slate-900">{{ (item.price * item.quantity) | currency:'EUR' }}</span>
        </div>
      </div>

      <!-- TOTALS -->
      <div class="border-t-2 border-slate-900 pt-4 space-y-1">
        <div class="flex justify-between text-xs font-bold text-slate-400">
           <span>Base Imponible (10%)</span>
           <span>{{ calculateSubtotal() | currency:'EUR' }}</span>
        </div>
        <div class="flex justify-between text-xs font-bold text-slate-400">
           <span>IVA (10%)</span>
           <span>{{ calculateIVA() | currency:'EUR' }}</span>
        </div>
        <div class="flex justify-between text-xl font-black text-slate-900 pt-2 tracking-tighter italic uppercase border-t border-slate-100 mt-2">
           <span>Total</span>
           <span>{{ ticketData?.total | currency:'EUR' }}</span>
        </div>
      </div>

      <!-- QR & FOOTER -->
      <div class="mt-10 text-center space-y-4">
        <div *ngIf="settings()?.socialMediaUrl" class="space-y-2">
           <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=' + settings()?.socialMediaUrl" 
                class="w-24 h-24 mx-auto border-4 border-white shadow-xl rounded-xl">
           <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Danos tu opinión</p>
        </div>
        
        <p class="text-[10px] font-bold text-slate-400 px-4">{{ settings()?.footerMessage }}</p>
        
        <div class="pt-4 flex flex-col gap-1">
          <span class="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Pastel Premium Fiscal POS</span>
          <span class="text-[7px] font-bold text-slate-200 truncate">{{ ticketData?.currentHash }}</span>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .ticket-container { width: 300px; margin: 0 auto; min-height: 500px; }
    @media print {
      .ticket-container { width: 80mm; padding: 5mm; box-shadow: none; border: none; }
      .no-print-shadow { box-shadow: none !important; }
    }
  `]
})
export class TicketComponent implements OnInit {
  @Input() ticketData: any;
  settings = signal<BusinessSettings | null>(null);

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings.set(res);
    });
  }

  calculateSubtotal() {
    return Number(this.ticketData?.total || 0) / 1.1;
  }

  calculateIVA() {
    return Number(this.ticketData?.total || 0) - this.calculateSubtotal();
  }
}
