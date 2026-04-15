import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InventoryService, Category, Product } from '../../services/inventory.service';
import { OrdersService, Ticket } from '../../services/orders.service';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="h-full flex gap-8 animate-slide-up overflow-hidden">
      <!-- Panel de Comanda (Izquierda) -->
      <aside class="w-[420px] flex flex-col gap-6 shrink-0 h-full">
        <div class="glass-panel flex-1 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-white bg-white/60">
          <!-- Cabecera Comanda -->
          <div class="p-8 border-b border-slate-100 flex justify-between items-start">
            <div class="flex flex-col">
              <div class="flex items-center space-x-2 mb-1">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                <h2 class="text-xs font-black uppercase tracking-widest text-slate-400">Ticket en curso</h2>
              </div>
              <h3 class="text-2xl font-display font-bold text-slate-800">Mesa #{{ tableNumber }}</h3>
            </div>
            <button routerLink="/floor-plan" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-sm">
               <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <!-- Items de Comanda -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <div *ngFor="let item of currentTicket?.items" 
                 class="flex flex-col p-4 bg-white/40 rounded-2xl border border-white hover:bg-white transition-all shadow-sm group">
              <div class="flex justify-between items-start mb-2">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-800">{{ item.product.name }}</span>
                    <!-- Badge de Estado -->
                    <span [ngClass]="{
                      'bg-orange-100 text-orange-600': item.status === 'PENDING',
                      'bg-blue-100 text-blue-600': item.status === 'PREPARING',
                      'bg-green-100 text-green-600': item.status === 'READY',
                      'bg-slate-100 text-slate-500': item.status === 'SERVED'
                    }" class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter">
                      {{ item.status }}
                    </span>
                  </div>
                  <span class="text-[10px] font-bold text-slate-400">x{{ item.quantity }} · {{ item.price | currency:'EUR' }}</span>
                </div>
                <span class="font-display font-bold text-slate-800 tracking-tight">{{ (item.price * item.quantity) | currency:'EUR' }}</span>
              </div>
              
              <!-- Notas si existen -->
              <div *ngIf="item.notes" class="flex items-center gap-1.5 text-rose-500 text-[11px] font-medium bg-rose-50/50 p-2 rounded-lg mb-2">
                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                <span>"{{ item.notes }}"</span>
              </div>

              <div class="flex justify-end gap-2">
                <button (click)="removeItem(item)" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 px-2 py-1 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>

            <div *ngIf="!currentTicket?.items?.length" class="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 py-20">
              <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              <p class="font-bold text-sm tracking-wide">Comanda vacía</p>
            </div>
          </div>

          <!-- Total Footer -->
          <div class="p-8 bg-white/80 border-t border-slate-100 flex flex-col gap-6">
            <!-- Selector de Notas Rápido -->
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Añadir nota al siguiente producto</label>
              <div class="flex gap-2">
                <input #noteInput type="text" placeholder="Ej: Sin cebolla, poco hecho..." 
                       class="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none">
                <button (click)="noteInput.value = ''" class="px-3 py-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            </div>

            <div class="flex justify-between items-end">
              <div class="flex flex-col">
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total a pagar</span>
                <span class="text-4xl font-display font-black text-slate-900 tracking-tighter">{{ currentTicket?.total || 0 | currency:'EUR' }}</span>
              </div>
              <div class="flex flex-col items-end text-xs font-bold text-indigo-500">
                <span>IVA Incluido (10%)</span>
                <span>Subtotal: {{ ((currentTicket?.total || 0) * 0.9) | currency:'EUR' }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
               <button class="py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold text-sm hover:bg-white transition-all shadow-sm">
                 Pre-Ticket
               </button>
               <button (click)="pay()" 
                       [disabled]="!currentTicket?.items?.length"
                       class="py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                 Cobrar Mesa
               </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Selector de Productos (Centro) -->
      <main class="flex-1 flex flex-col gap-8 h-full overflow-hidden">
        <!-- Categorías Selector -->
        <div class="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar shrink-0">
          <button 
            *ngFor="let cat of categories"
            (click)="selectCategory(cat.id)"
            [class.bg-white]="selectedCategoryId === cat.id"
            [class.shadow-soft]="selectedCategoryId === cat.id"
            [class.text-indigo-600]="selectedCategoryId === cat.id"
            class="px-8 py-4 bg-white/30 border border-white rounded-[1.5rem] font-bold text-sm whitespace-nowrap transition-all hover:bg-white">
            {{ cat.name }}
          </button>
        </div>

        <!-- Productos Grid -->
        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
          <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            <button 
              *ngFor="let product of filteredProducts"
              (click)="addProduct(product, noteInput.value); noteInput.value = ''"
              class="glass-panel p-6 rounded-[2.5rem] flex flex-col gap-4 text-left group hover:scale-[1.02] hover:bg-white hover:shadow-2xl transition-all duration-300 border-white/50 relative overflow-hidden h-64">
              <div class="absolute -top-1 -right-1 w-12 h-12 bg-indigo-500/5 rounded-bl-[1.5rem] flex items-center justify-center text-indigo-600 font-black text-xs">
                +
              </div>
              <div class="w-full aspect-square bg-slate-50/50 rounded-2xl flex items-center justify-center text-slate-200 group-hover:text-indigo-200 transition-colors shrink-0">
                 <svg width="40" height="40" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400">{{ product.category?.name }}</span>
                <h4 class="font-bold text-slate-800 text-lg group-hover:text-indigo-600 italic line-clamp-1">{{ product.name }}</h4>
              </div>
              <div class="mt-auto pt-2 flex justify-between items-center">
                <span class="text-xl font-display font-black text-slate-900 tracking-tighter">{{ product.price | currency:'EUR' }}</span>
                <div class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 scale-0 group-hover:scale-100 transition-transform duration-300">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14 m5 12h14"></path></svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; height: calc(100vh - 120px); }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
  `]

})
export class POSComponent implements OnInit {
  tableId: string = '';
  tableNumber: string = '0';
  userId: string = 'SYSTEM_USER';

  categories: Category[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategoryId: string | null = null;
  currentTicket: any | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private ordersService: OrdersService
  ) {}

  ngOnInit() {
    this.tableId = this.route.snapshot.paramMap.get('tableId') || '';
    
    this.loadData();
    this.refreshTicket();
  }

  loadData() {
    this.inventoryService.getCategories().subscribe(cats => {
      this.categories = cats;
      if (cats.length > 0) {
        this.selectCategory(cats[0].id);
      }
    });
    this.inventoryService.getProducts().subscribe(prods => {
      this.products = prods;
      this.filterProducts();
    });
  }

  refreshTicket() {
    this.ordersService.getActiveTicket(this.tableId, this.userId).subscribe(ticket => {
      this.currentTicket = ticket;
      this.tableNumber = ticket.table?.number?.toString() || this.tableId.substring(0, 3).toUpperCase();
    });
  }

  selectCategory(id: string) {
    this.selectedCategoryId = id;
    this.filterProducts();
  }

  filterProducts() {
    if (this.selectedCategoryId) {
      this.filteredProducts = this.products.filter(p => p.categoryId === this.selectedCategoryId);
    } else {
      this.filteredProducts = this.products;
    }
  }

  addProduct(product: Product, notes?: string) {
    if (!this.currentTicket) return;
    this.ordersService.addItem(this.currentTicket.id, product.id, 1, notes).subscribe(ticket => {
      this.currentTicket = ticket;
    });
  }

  removeItem(item: any) {
    if (!this.currentTicket) return;
    this.ordersService.addItem(this.currentTicket.id, item.productId, -1, item.notes).subscribe(ticket => {
      this.currentTicket = ticket;
    });
  }

  pay() {
    if (!this.currentTicket) return;
    if (confirm('¿Deseas cerrar la mesa y proceder al cobro?')) {
      this.ordersService.payTicket(this.currentTicket.id).subscribe(() => {
        alert('Pago procesado correctamente');
        this.router.navigate(['/floor-plan']);
      });
    }
  }
}

