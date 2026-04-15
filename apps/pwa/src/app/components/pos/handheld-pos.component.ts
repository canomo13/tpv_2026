import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloorPlanService, Zone, HandheldTable } from '../../services/floor-plan.service';
import { InventoryService, Product, Category } from '../../services/inventory.service';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-handheld-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen flex flex-col bg-slate-50 overflow-hidden select-none">
      <!-- Top Bar -->
      <header class="bg-white px-6 py-4 flex justify-between items-center shadow-soft shrink-0 z-20">
        <div class="flex items-center gap-3">
          <div (click)="resetFlow()" class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-800 tracking-tight italic">Comandero</h1>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ stepLabel() }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4">
           <span class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">{{ authService.currentUser()?.name }}</span>
           <button (click)="authService.logout()" class="text-slate-300 hover:text-rose-500 transition-all">
             <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
           </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-4 relative custom-scrollbar">
        
        <!-- STEP 1: SELECT ZONE -->
        <div *ngIf="currentStep() === 'SELECT_ZONE'" class="animate-content-in grid grid-cols-1 gap-4 pb-10">
           <button *ngFor="let zone of zones" 
                   (click)="selectZone(zone)"
                   class="p-10 bg-white rounded-[2.5rem] border border-slate-100 hover:border-indigo-200 active:scale-95 transition-all shadow-xl shadow-slate-200/40 flex flex-col items-center gap-4 group">
             <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>
             </div>
             <span class="text-2xl font-black text-slate-800 tracking-tight">{{ zone.name }}</span>
             <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ zone.tables?.length || 0 }} MESAS</span>
           </button>
        </div>

        <!-- STEP 2: SELECT TABLE -->
        <div *ngIf="currentStep() === 'SELECT_TABLE'" class="animate-content-in grid grid-cols-3 gap-4 pb-10">
           <button *ngFor="let table of selectedZone?.tables" 
                   (click)="selectTable(table)"
                   [class.bg-rose-500]="table.status === 'occupied'"
                   [class.text-white]="table.status === 'occupied'"
                   [class.bg-white]="table.status === 'free'"
                   class="h-28 rounded-3xl shadow-soft flex flex-col items-center justify-center gap-1 active:scale-90 transition-all border border-slate-100 relative overflow-hidden">
             <div *ngIf="table.status === 'occupied'" class="absolute top-0 right-0 p-1 bg-white/20 rounded-bl-xl">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path></svg>
             </div>
             <span class="text-3xl font-black tracking-tighter">{{ table.number }}</span>
             <span class="text-[9px] font-black uppercase opacity-60">{{ table.status }}</span>
           </button>
        </div>

        <!-- STEP 3: ORDERING & TICKET VIEW -->
        <div *ngIf="currentStep() === 'ORDERING'" class="flex flex-col h-full gap-5 animate-content-in">
          <!-- Ticket Header Quick Actions -->
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-2xl font-black text-slate-800 italic tracking-tighter">Mesa {{ selectedTable?.number }}</h2>
            <div class="flex gap-2">
                <button (click)="payTicket()" [disabled]="!activeTicket || activeTicket.items.length === 0" 
                        class="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-30">
                  Cobrar
                </button>
            </div>
          </div>

          <!-- Items ya en cocina (Read Only or Adjust) -->
          <div *ngIf="activeTicket?.items?.length" class="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100/50 mb-2">
            <h4 class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 px-2">Ticket Actuall</h4>
            <div class="space-y-2">
                <div *ngFor="let item of activeTicket?.items" class="flex items-center justify-between p-3 bg-white/60 rounded-2xl border border-white">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-slate-800">{{ item.product.name }} <span class="text-indigo-600">x{{ item.quantity }}</span></span>
                        <div class="flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{
                                'bg-orange-400': item.status === 'PENDING',
                                'bg-blue-400': item.status === 'PREPARING',
                                'bg-green-400': item.status === 'READY',
                                'bg-slate-400': item.status === 'SERVED'
                            }"></span>
                            <span class="text-[9px] font-black uppercase opacity-50">{{ item.status }}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <!-- Categorías Scroll -->
          <div class="flex gap-2 overflow-x-auto pb-2 shrink-0 no-scrollbar">
            <button (click)="selectCategory(null)"
                    [class.bg-slate-800]="!selectedCategoryId"
                    [class.text-white]="!selectedCategoryId"
                    class="px-6 py-3 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm border border-slate-100">
              Todos
            </button>
            <button *ngFor="let cat of categories" 
                    (click)="selectCategory(cat.id)"
                    [class.bg-slate-800]="selectedCategoryId === cat.id"
                    [class.text-white]="selectedCategoryId === cat.id"
                    class="px-6 py-3 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm border border-slate-100">
              {{ cat.name }}
            </button>
          </div>

          <!-- Grid Productos -->
          <div class="grid grid-cols-2 gap-4 pb-48">
            <button *ngFor="let p of filteredProducts()" 
                    (click)="addToOrder($event, p)"
                    class="p-5 bg-white rounded-[2rem] flex flex-col gap-2 items-start text-left shadow-lg shadow-slate-200/30 border border-slate-50 active:bg-indigo-50 active:scale-95 transition-all h-36 relative overflow-hidden group">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-active:text-indigo-600 group-active:bg-white transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
              </div>
              <span class="text-sm font-black text-slate-800 leading-tight italic">{{ p.name }}</span>
              <span class="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{{ p.price | currency:'EUR' }}</span>
              <div class="absolute -bottom-1 -right-1 w-10 h-10 bg-indigo-600 rounded-tl-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                +
              </div>
            </button>
          </div>
        </div>
      </main>


      <!-- Floating Order Summary (Only in ordering step) -->
      <div *ngIf="currentStep() === 'ORDERING' && currentOrderItems.length > 0" 
           class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent z-30">
        <div class="bg-slate-800 text-white rounded-3xl p-5 shadow-2xl flex items-center justify-between gap-6 ring-8 ring-white/10">
          <div (click)="showOrderDetail = !showOrderDetail" class="flex flex-col flex-1 truncate">
            <span class="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Pedido Actual • Mesa {{ selectedTable?.number }}</span>
            <span class="text-lg font-black truncate">{{ currentOrderItems.length }} Productos Seleccionados</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right flex flex-col items-end">
              <span class="text-[10px] font-black uppercase opacity-60">Total</span>
              <span class="text-xl font-black">{{ calculateTotal() | currency:'EUR' }}</span>
            </div>
            <button (click)="submitOrder()" 
                    class="px-8 py-4 bg-indigo-600 rounded-2xl font-black hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-900/40">
              ENVIAR
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div *ngIf="showOrderDetail" class="fixed inset-0 z-[100] flex items-end p-4 bg-slate-900/60 backdrop-blur-sm animate-with-fade-in">
        <div class="bg-white rounded-[3rem] p-8 w-full shadow-2xl animate-content-in max-h-[80vh] flex flex-col">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-black text-slate-800 italic">Revisar Comanda</h3>
            <button (click)="showOrderDetail = false" class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
               <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
          
          <div class="flex-1 overflow-y-auto space-y-3 mb-6 pr-2">
            <div *ngFor="let item of currentOrderItems; let i = index" class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <span class="font-black text-indigo-600 text-lg w-8">{{ item.quantity }}x</span>
              <span class="flex-1 font-bold text-slate-800">{{ item.name }}</span>
              <div class="flex gap-2">
                 <button (click)="removeItem(i)" class="w-10 h-10 bg-white text-rose-500 rounded-xl flex items-center justify-center shadow-sm">-</button>
                 <button (click)="item.quantity = item.quantity + 1" class="w-10 h-10 bg-white text-emerald-500 rounded-xl flex items-center justify-center shadow-sm">+</button>
              </div>
            </div>
          </div>

          <button (click)="submitOrder()" class="w-full py-6 bg-slate-800 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-slate-200 uppercase tracking-widest active:scale-95 transition-all">
             Enviar a Cocina • {{ calculateTotal() | currency:'EUR' }}
          </button>
        </div>
      </div>

      <!-- User Role Notification -->
      <div *ngIf="currentStep() === 'SELECT_ZONE'" class="fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-xl shadow-indigo-100 animate-bounce">
         <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
         <span class="text-[10px] font-black uppercase tracking-widest">Listo para comandar</span>
      </div>
    </div>
  `,
  styles: [`
    @keyframes content-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .animate-content-in { animation: content-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .shadow-soft { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
  `]

})
export class HandheldPosComponent implements OnInit {
  currentStep = signal<'SELECT_ZONE' | 'SELECT_TABLE' | 'ORDERING'>('SELECT_ZONE');
  
  zones: Zone[] = [];
  categories: Category[] = [];
  products: Product[] = [];
  
  selectedZone: Zone | null = null;
  selectedTable: HandheldTable | null = null;
  selectedCategoryId: string | null = null;

  activeTicket: any | null = null; // Ticket de la base de datos
  currentOrderItems: any[] = []; // Items locales (pendientes de enviar)
  showOrderDetail = false;

  constructor(
    public floorPlanService: FloorPlanService,
    private inventoryService: InventoryService,
    private ordersService: OrdersService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.floorPlanService.getZones().subscribe(res => this.zones = res);
    this.inventoryService.getCategories().subscribe(res => this.categories = res);
    this.inventoryService.getProducts().subscribe(res => this.products = res);
  }

  stepLabel() {
    switch(this.currentStep()) {
      case 'SELECT_ZONE': return 'Seleccione Zona';
      case 'SELECT_TABLE': return 'Seleccione Mesa';
      case 'ORDERING': return 'Tomando Pedido';
    }
  }

  selectZone(zone: Zone) {
    this.selectedZone = zone;
    this.currentStep.set('SELECT_TABLE');
  }

  selectTable(table: HandheldTable) {
    this.selectedTable = table;
    const userId = this.authService.currentUser()?.id || 'SYSTEM';
    
    // Cargar ticket activo si existe
    this.ordersService.getActiveTicket(table.id, userId).subscribe(ticket => {
      this.activeTicket = ticket;
      this.currentStep.set('ORDERING');
    });
  }

  selectCategory(id: string | null) {
    this.selectedCategoryId = id;
  }

  filteredProducts() {
    if (!this.selectedCategoryId) return this.products;
    return this.products.filter(p => p.categoryId === this.selectedCategoryId);
  }

  addToOrder(event: Event, product: Product) {
    // Animación simple de escala al pulsar
    const btn = event.currentTarget as HTMLElement;
    btn.classList.add('scale-95');
    setTimeout(() => btn.classList.remove('scale-95'), 100);

    const existing = this.currentOrderItems.find(i => i.productId === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.currentOrderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
  }

  removeItem(index: number) {
    if (this.currentOrderItems[index].quantity > 1) {
      this.currentOrderItems[index].quantity--;
    } else {
      this.currentOrderItems.splice(index, 1);
    }
    if (this.currentOrderItems.length === 0) this.showOrderDetail = false;
  }

  calculateTotal() {
    const localTotal = this.currentOrderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const activeTotal = this.activeTicket?.total || 0;
    return Number(localTotal) + Number(activeTotal);
  }

  submitOrder() {
    if (!this.selectedTable || !this.activeTicket) return;
    
    // Si ya hay un ticket activo, añadimos items
    const ops = this.currentOrderItems.map(item => 
      this.ordersService.addItem(this.activeTicket.id, item.productId, item.quantity, '')
    );

    // Ejecutar todas las adiciones
    import('rxjs').then(({ forkJoin }) => {
      forkJoin(ops).subscribe(() => {
        alert('Comanda enviada a cocina');
        this.resetFlow();
      });
    });
  }

  payTicket() {
    if (!this.activeTicket) return;
    if (confirm(`¿Proceder al cobro de ${this.calculateTotal()}€?`)) {
      this.ordersService.payTicket(this.activeTicket.id).subscribe(() => {
        alert('Mesa cobrada y cerrada');
        this.resetFlow();
      });
    }
  }

  resetFlow() {
    this.currentStep.set('SELECT_ZONE');
    this.selectedZone = null;
    this.selectedTable = null;
    this.activeTicket = null;
    this.currentOrderItems = [];
    this.showOrderDetail = false;
  }
}

