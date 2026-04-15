import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService, Ticket, TicketItem } from '../../services/orders.service';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-6">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 tracking-tight">Monitor de Cocina</h1>
          <p class="text-slate-500">Gestión de comandas en tiempo real</p>
        </div>
        <div class="flex gap-4">
          <div class="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <span class="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-slate-600">{{ pendingCount }} Pendientes</span>
          </div>
          <div class="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
            <span class="w-3 h-3 bg-blue-400 rounded-full"></span>
            <span class="text-sm font-medium text-slate-600">{{ preparingCount }} En proceso</span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Tarjeta de Comanda -->
        <div *ngFor="let ticket of tickets" 
             class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:-translate-y-1">
          
          <!-- Cabecera de Comanda -->
          <div class="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Mesa</span>
              <h3 class="text-2xl font-black text-slate-800">#{{ ticket.table?.number || '?' }}</h3>
            </div>
            <div class="text-right">
              <span class="text-xs font-medium text-slate-400 block">{{ formatTime(ticket.createdAt) }}</span>
              <span class="px-2 py-1 bg-slate-200 text-[10px] font-bold rounded-lg text-slate-600 uppercase">{{ ticket.status }}</span>
            </div>
          </div>

          <!-- Items de la Comanda -->
          <div class="p-4 flex-grow space-y-3">
            <div *ngFor="let item of ticket.items" 
                 class="group relative p-3 rounded-2xl border transition-all"
                 [ngClass]="{
                   'bg-orange-50 border-orange-100': item.status === 'PENDING',
                   'bg-blue-50 border-blue-100': item.status === 'PREPARING',
                   'bg-green-50 border-green-100 opacity-60': item.status === 'READY'
                 }">
              <div class="flex justify-between items-start">
                <div class="flex gap-3">
                  <span class="font-black text-lg" [ngClass]="item.status === 'PENDING' ? 'text-orange-600' : 'text-slate-600'">
                    {{ item.quantity }}x
                  </span>
                  <div>
                    <h4 class="font-bold text-slate-800 leading-tight">{{ item.product.name }}</h4>
                    <p *ngIf="item.notes" class="text-xs text-rose-500 font-medium mt-1 italic italic">
                      "{{ item.notes }}"
                    </p>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción para el Item -->
              <div class="mt-3 flex gap-2">
                <button *ngIf="item.status === 'PENDING'" 
                        (click)="updateStatus(item.id, 'PREPARING')"
                        class="flex-1 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-orange-200">
                  EMPEZAR
                </button>
                <button *ngIf="item.status === 'PREPARING'" 
                        (click)="updateStatus(item.id, 'READY')"
                        class="flex-1 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-blue-200">
                  LISTO
                </button>
                <div *ngIf="item.status === 'READY'" class="flex-1 text-center py-1.5 text-green-600 text-xs font-black">
                  ✓ COMPLETADO
                </div>
              </div>
            </div>
          </div>

          <!-- Footer de Comanda -->
          <div class="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
            <button class="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
              Ver detalles completos
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="tickets.length === 0" class="col-span-full py-20 text-center">
          <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-4xl">🍳</span>
          </div>
          <h2 class="text-2xl font-bold text-slate-400">Cocina limpia</h2>
          <p class="text-slate-300">No hay comandas pendientes en este momento</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class KitchenComponent implements OnInit, OnDestroy {
  tickets: any[] = [];
  private subs = new Subscription();

  constructor(
    private ordersService: OrdersService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    this.loadOrders();

    // Escuchar nuevos pedidos
    this.subs.add(
      this.socketService.onNewOrder().subscribe(newItem => {
        this.loadOrders(); // Recarga simple para asegurar consistencia
        this.playNotificationSound();
      })
    );

    // Escuchar cambios de estado
    this.subs.add(
      this.socketService.onStatusChange().subscribe(updatedItem => {
        // En una app real, buscaríamos el item y lo actualizaríamos en local
        // Para asegurar orden y filtros, volvemos a cargar (o filtramos en local)
        this.loadOrders();
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  loadOrders() {
    this.ordersService.getKitchenOrders().subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  updateStatus(itemId: string, status: string) {
    this.ordersService.updateItemStatus(itemId, status).subscribe(() => {
      // La actualización vendrá por el socket o por la respuesta
      this.loadOrders();
    });
  }

  get pendingCount() {
    return this.tickets.reduce((acc, t) => 
      acc + t.items.filter((i: any) => i.status === 'PENDING').length, 0);
  }

  get preparingCount() {
    return this.tickets.reduce((acc, t) => 
      acc + t.items.filter((i: any) => i.status === 'PREPARING').length, 0);
  }

  formatTime(dateString: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private playNotificationSound() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {}); // Ignorar si el navegador bloquea el autoplay
  }
}
