import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Ticket } from '../../services/orders.service';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-900 p-8 flex flex-col gap-8 no-print select-none h-screen overflow-hidden">
      <!-- Top Bar KDS -->
      <header class="flex justify-between items-center bg-slate-800/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-700/50 shrink-0">
        <div class="flex items-center gap-6">
          <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
            <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
          </div>
          <div>
            <h1 class="text-3xl font-black text-white italic tracking-tighter">Kitchen <span class="text-indigo-400">Display</span></h1>
            <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Sincronización en Tiempo Real • {{ now() | date:'HH:mm:ss' }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex flex-col items-center px-6 py-2 bg-slate-800 rounded-2xl border border-slate-700 shadow-inner">
             <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pendientes</span>
             <span class="text-xl font-black text-orange-400">{{ pendingCount }}</span>
          </div>
          <button (click)="toggleFullscreen()" class="w-14 h-14 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl transition-all active:scale-90 flex items-center justify-center">
             <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path></svg>
          </button>
        </div>
      </header>

      <!-- Grid de Comandas -->
      <main class="flex-1 overflow-x-auto overflow-y-hidden pb-4 flex gap-6 custom-scrollbar">
        
        <div *ngFor="let ticket of tickets" 
             class="w-[320px] shrink-0 flex flex-col bg-slate-800 rounded-[2.5rem] border border-slate-700/50 shadow-2xl animate-card-in overflow-hidden h-full">
          
          <!-- Timer Header -->
          <div class="p-5 flex justify-between items-center border-b border-slate-700/50"
               [ngClass]="getTicketUrgencyClass(ticket)">
             <div class="flex flex-col">
                <span class="text-3xl font-black tracking-tighter italic">#{{ ticket.table?.number || '?' }}</span>
                <span class="text-[9px] font-black uppercase tracking-widest opacity-60">Mesa</span>
             </div>
             <div class="flex flex-col items-end">
                <span class="text-2xl font-mono font-black tabular-nums">{{ getElapsedTime(ticket.createdAt) }}</span>
                <span class="text-[9px] font-black uppercase tracking-widest opacity-60">Esperando</span>
             </div>
          </div>

          <!-- Items Scroll Area -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <div *ngFor="let item of ticket.items" 
                 class="p-4 rounded-3xl border transition-all flex flex-col gap-3 group"
                 [ngClass]="{
                   'bg-slate-700/30 border-slate-600': item.status === 'PENDING',
                   'bg-indigo-600/20 border-indigo-500/30': item.status === 'PREPARING',
                   'bg-emerald-500/10 border-emerald-500/20 opacity-50': item.status === 'READY'
                 }">
              
              <div class="flex justify-between items-start">
                <div class="flex gap-4">
                  <span class="text-xl font-black" [ngClass]="item.status === 'PENDING' ? 'text-indigo-400' : 'text-slate-400'">
                    {{ item.quantity }}x
                  </span>
                  <div class="flex flex-col gap-1">
                    <h4 class="font-bold text-white text-sm leading-tight uppercase tracking-tight">{{ item.product.name }}</h4>
                    <p *ngIf="item.notes" class="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-1 rounded-lg">
                       "{{ item.notes }}"
                    </p>
                  </div>
                </div>
              </div>

              <!-- Item Actions -->
              <div class="flex gap-2">
                <button *ngIf="item.status === 'PENDING'" 
                        (click)="updateStatus(item.id, 'PREPARING')"
                        class="flex-1 py-3 bg-indigo-600 text-white font-black text-[10px] uppercase rounded-2xl shadow-lg shadow-indigo-900/40 active:scale-95 transition-all">
                  PREPARAR
                </button>
                <button *ngIf="item.status === 'PREPARING'" 
                        (click)="updateStatus(item.id, 'READY')"
                        class="flex-1 py-3 bg-emerald-500 text-white font-black text-[10px] uppercase rounded-2xl shadow-lg shadow-emerald-900/40 active:scale-95 transition-all">
                  TERMINAR
                </button>
                <div *ngIf="item.status === 'READY'" class="w-full text-center py-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                   <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
                   Listo
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Info -->
          <div class="p-4 bg-slate-900/30 border-t border-slate-700/50 flex justify-between items-center">
             <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ ticket.user?.name }}</span>
             <span class="text-[10px] font-black text-slate-600 tabular-nums">{{ ticket.createdAt | date:'HH:mm' }}</span>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="tickets.length === 0" class="flex-1 flex flex-col items-center justify-center animate-fade-in opacity-30">
           <div class="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <span class="text-6xl">🔥</span>
           </div>
           <h2 class="text-3xl font-black text-white italic tracking-tighter">Cocina Despejada</h2>
           <p class="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">No hay comandas pendientes</p>
        </div>

      </main>
    </div>
  `,
  styles: [`
    @keyframes card-in { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    .animate-card-in { animation: card-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .custom-scrollbar::-webkit-scrollbar { height: 10px; width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 20px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
  `]
})
export class KitchenComponent implements OnInit, OnDestroy {
  tickets: Ticket[] = [];
  now = signal(new Date());
  private subs = new Subscription();

  constructor(
    private ordersService: OrdersService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.loadOrders();

    // Timer para refrescar "now" cada segundo
    setInterval(() => this.now.set(new Date()), 1000);

    // Escuchar nuevos pedidos
    this.subs.add(
      this.socketService.onNewOrder().subscribe(() => {
        this.loadOrders();
        this.playNotificationSound();
      })
    );

    // Escuchar cambios de estado
    this.subs.add(
      this.socketService.onStatusChange().subscribe(() => this.loadOrders())
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadOrders() {
    this.ordersService.getKitchenOrders().subscribe(tickets => {
      // Ordenar por antigüedad (más viejos primero)
      this.tickets = tickets.sort((a: Ticket, b: Ticket) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    });
  }

  updateStatus(itemId: string, status: string) {
    this.ordersService.updateItemStatus(itemId, status).subscribe(() => this.loadOrders());
  }

  get pendingCount() {
    return this.tickets.length;
  }

  getElapsedTime(createdAt: string): string {
    const start = new Date(createdAt).getTime();
    const current = this.now().getTime();
    const diff = current - start;

    const min = Math.floor(diff / 60000);
    const sec = Math.floor((diff % 60000) / 1000);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  getTicketUrgencyClass(ticket: Ticket) {
    const start = new Date(ticket.createdAt).getTime();
    const diffMin = (this.now().getTime() - start) / 60000;

    if (diffMin >= 10) return 'bg-rose-500 text-white shadow-lg shadow-rose-900/40';
    if (diffMin >= 5) return 'bg-orange-400 text-white shadow-lg shadow-orange-900/40';
    return 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40';
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (typeof document.exitFullscreen === 'function') {
        document.exitFullscreen();
      }
    }
  }

  private playNotificationSound() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});
  }
}
