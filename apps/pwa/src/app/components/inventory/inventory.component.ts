import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, Category, Product, Ingredient, Warehouse, Stock, RecipeItem } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full gap-8 animate-slide-up">
      <!-- Header con Tabs Premium -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div class="flex flex-col">
          <h1 class="text-3xl font-display font-black text-slate-800 tracking-tight">Gestión de Inventario</h1>
          <p class="text-slate-400 font-medium">Control total de stock, almacenes y escandallos</p>
        </div>
        
        <nav class="flex bg-white/50 p-1.5 rounded-2xl border border-white shadow-soft">
          <button (click)="currentTab = 'products'" 
                  [class.bg-white]="currentTab === 'products'"
                  [class.text-indigo-600]="currentTab === 'products'"
                  [class.shadow-sm]="currentTab === 'products'"
                  class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400">
            Productos
          </button>
          <button (click)="currentTab = 'warehouses'" 
                  [class.bg-white]="currentTab === 'warehouses'"
                  [class.text-indigo-600]="currentTab === 'warehouses'"
                  [class.shadow-sm]="currentTab === 'warehouses'"
                  class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400">
            Almacenes
          </button>
          <button (click)="currentTab = 'ingredients'" 
                  [class.bg-white]="currentTab === 'ingredients'"
                  [class.text-indigo-600]="currentTab === 'ingredients'"
                  [class.shadow-sm]="currentTab === 'ingredients'"
                  class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400">
            Ingredientes
          </button>
        </nav>
      </div>

      <!-- VISTA: PRODUCTOS -->
      <div *ngIf="currentTab === 'products'" class="flex flex-col lg:flex-row gap-10 h-full">
        <!-- Sidebar Categorías -->
        <aside class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div class="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-soft border-white/40">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-indigo-500 uppercase tracking-widest">Categorías</h3>
              <button (click)="showCategoryModal = true" class="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-white shadow-sm">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
              </button>
            </div>
            <div class="flex flex-col gap-2">
              <button (click)="selectCategory(null)"
                      [class.bg-indigo-600]="!selectedCategoryId"
                      [class.text-white]="!selectedCategoryId"
                      class="w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm text-slate-600 hover:bg-white/40">
                <span>Todas</span>
                <span class="px-2 py-0.5 bg-white/20 rounded-lg text-[10px]">{{ products.length }}</span>
              </button>
              <div *ngFor="let cat of categories" class="group relative">
                <button (click)="selectCategory(cat.id)"
                        [class.bg-white]="selectedCategoryId === cat.id"
                        [class.text-indigo-600]="selectedCategoryId === cat.id"
                        class="w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm text-slate-600 hover:bg-white/40">
                  <span>{{ cat.name }}</span>
                  <span class="px-2 py-0.5 bg-slate-100 rounded-lg text-[10px]">{{ cat._count?.products }}</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <!-- Grid de Productos -->
        <div class="flex-1 flex flex-col gap-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-800">{{ getSelectedCategoryName() }}</h2>
            <button (click)="showProductModal = true" class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 items-center flex gap-2">
               <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
               Nuevo Producto
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div *ngFor="let product of products" class="glass-card p-6 rounded-[2.5rem] flex flex-col gap-4 group hover:bg-white transition-all shadow-lg shadow-slate-200/50">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-slate-800 text-lg">{{ product.name }}</h3>
                  <p class="text-[10px] uppercase font-black text-slate-400">{{ product.category?.name }}</p>
                </div>
                <span class="text-lg font-black text-indigo-600">{{ product.price | currency:'EUR' }}</span>
              </div>
              <p class="text-xs text-slate-400 line-clamp-2 h-8">{{ product.description }}</p>
              
              <div class="mt-auto flex justify-between items-center bg-slate-50 p-2 rounded-2xl">
                 <button (click)="openRecipeEditor(product)" class="flex items-center gap-2 px-4 py-2 bg-white text-indigo-500 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 hover:text-white transition-all border border-indigo-50">
                   <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                   Escandallo
                 </button>
                 <div class="flex gap-2">
                    <button (click)="editProduct(product)" class="w-8 h-8 rounded-lg bg-white text-slate-400 flex items-center justify-center hover:text-indigo-500 shadow-sm border border-slate-100">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button (click)="deleteProduct(product.id)" class="w-8 h-8 rounded-lg bg-white text-rose-300 flex items-center justify-center hover:text-rose-500 shadow-sm border border-slate-100">
                      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- VISTA: ALMACENES -->
      <div *ngIf="currentTab === 'warehouses'" class="flex flex-col lg:flex-row gap-10 h-full">
        <aside class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div class="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-soft border-white/40">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-indigo-500 uppercase tracking-widest">Mis Almacenes</h3>
              <button (click)="showWarehouseModal = true" class="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-white shadow-sm">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
              </button>
            </div>
            <div class="flex flex-col gap-2">
              <button *ngFor="let wh of warehouses" 
                      (click)="selectWarehouse(wh)"
                      [class.bg-indigo-600]="selectedWarehouse?.id === wh.id"
                      [class.text-white]="selectedWarehouse?.id === wh.id"
                      class="w-full flex items-center justify-between p-4 rounded-2xl font-bold text-sm text-slate-600 hover:bg-white/40 transition-all">
                <span>{{ wh.name }}</span>
                <span class="px-2 py-0.5 bg-white/20 rounded-lg text-[10px]">{{ wh._count?.stocks }} items</span>
              </button>
            </div>
          </div>
        </aside>

        <div class="flex-1 flex flex-col gap-6">
          <div class="flex justify-between items-center" *ngIf="selectedWarehouse">
            <div>
              <h2 class="text-2xl font-black text-slate-800">Inventario: {{ selectedWarehouse.name }}</h2>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Gestión de existencias actual</p>
            </div>
          </div>
          
          <div class="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingrediente</th>
                  <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Cantidad</th>
                  <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr *ngFor="let s of warehouseStocks" class="hover:bg-slate-50 transition-colors">
                  <td class="px-8 py-5">
                    <span class="font-bold text-slate-800">{{ s.ingredient?.name }}</span>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span class="font-black text-slate-900 text-lg">{{ s.quantity }}</span>
                    <span class="text-slate-400 ml-1 text-xs">{{ s.ingredient?.unit }}</span>
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter"
                          [ngClass]="s.quantity > (s.ingredient?.minStock || 0) ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600 animate-pulse'">
                      {{ s.quantity > (s.ingredient?.minStock || 0) ? 'Stock OK' : 'Stock Crítico' }}
                    </span>
                  </td>
                  <td class="px-8 py-5 text-right">
                    <button (click)="openAdjustmentDialog(s)" class="text-xs font-black text-indigo-500 hover:text-indigo-700">AJUSTAR</button>
                  </td>
                </tr>
                <tr *ngIf="warehouseStocks.length === 0">
                  <td colspan="4" class="px-8 py-20 text-center text-slate-300 font-bold">
                    No hay existencias registradas en este almacén
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- VISTA: INGREDIENTES -->
      <div *ngIf="currentTab === 'ingredients'" class="flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-black text-slate-800">Maestro de Ingredientes</h2>
          <button (click)="showIngredientModal = true" class="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 items-center flex gap-2">
               <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
               Añadir Ingrediente
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let ing of ingredients" class="glass-panel p-6 rounded-[2.5rem] bg-white hover:shadow-xl transition-all border-white border relative">
            <h4 class="text-lg font-bold text-slate-800">{{ ing.name }}</h4>
            <div class="flex flex-col gap-1 mt-2">
              <span class="text-[10px] font-black uppercase text-slate-400">Escandallo por {{ ing.unit }}</span>
              <span class="font-black text-indigo-600 text-sm">{{ ing.cost | currency:'EUR' }} / {{ ing.unit }}</span>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span class="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Min: {{ ing.minStock }}{{ ing.unit }}</span>
              <button class="w-8 h-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center hover:text-indigo-500">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL: EDITOR DE RECETA (ESCANDALLO) -->
      <div *ngIf="showRecipeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl animate-slide-up border border-white h-[80vh] flex flex-col">
          <div class="flex justify-between items-start mb-8">
            <div>
              <h3 class="text-3xl font-black text-slate-800 italic tracking-tighter">Escandallo: {{ editingProductForRecipe?.name }}</h3>
              <p class="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Configuración de ficha técnica</p>
            </div>
            <button (click)="showRecipeModal = false" class="text-slate-300 hover:text-slate-600">
               <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar">
            <!-- Selector de Ingrediente -->
            <div class="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <label class="text-[10px] font-black uppercase text-slate-400 ml-2 block mb-3">Añadir Ingrediente a la Mezcla</label>
              <div class="flex gap-4">
                <select #ingSelect class="flex-1 p-4 bg-white border-none rounded-2xl font-bold shadow-sm outline-none">
                  <option *ngFor="let ing of ingredients" [value]="ing.id">{{ ing.name }} ({{ ing.unit }})</option>
                </select>
                <input #ingQty type="number" placeholder="Cant." class="w-32 p-4 bg-white border-none rounded-2xl font-bold shadow-sm outline-none">
                <button (click)="addIngredientToRecipe(ingSelect.value, +ingQty.value); ingQty.value = ''" 
                        class="px-6 bg-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-all">
                  +
                </button>
              </div>
            </div>

            <!-- Listado Receta Actual -->
            <div class="space-y-3">
               <div *ngFor="let item of recipeItems; let i = index" 
                    class="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                 <div class="flex flex-col">
                   <span class="font-bold text-slate-800">{{ getIngredientName(item.ingredientId) }}</span>
                   <span class="text-[10px] text-slate-400 font-bold">Coste unitario: {{ getIngredientCost(item.ingredientId) | currency:'EUR' }}</span>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="flex flex-col items-center">
                      <span class="text-lg font-black text-slate-900">{{ item.quantity }}</span>
                      <span class="text-[9px] font-black uppercase text-indigo-400">{{ getIngredientUnit(item.ingredientId) }}</span>
                    </div>
                    <button (click)="recipeItems.splice(i, 1)" class="w-10 h-10 bg-rose-50 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white">
                      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                 </div>
               </div>
            </div>
          </div>

          <!-- Total Estimado -->
          <div class="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
            <div class="flex flex-col">
              <span class="text-[10px] font-black uppercase text-slate-400">Coste Total Escandallo</span>
              <span class="text-3xl font-black text-indigo-600 tracking-tighter">{{ calculateTotalCost() | currency:'EUR' }}</span>
            </div>
            <button (click)="saveRecipe()" class="px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
              Guardar Ficha Técnica
            </button>
          </div>
        </div>
      </div>

      <!-- OTROS MODALES SIMPLES -->
      <div *ngIf="showIngredientModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-with-fade-in">
           <h3 class="text-2xl font-black text-slate-800 mb-6">Nuevo Ingrediente</h3>
           <div class="space-y-4">
              <input [(ngModel)]="newIngredient.name" placeholder="Nombre (Ej: Patatas Patatas)" class="w-full p-4 bg-slate-50 border rounded-xl">
              <div class="grid grid-cols-2 gap-4">
                <input [(ngModel)]="newIngredient.unit" placeholder="Unidad (kg, l, ud)" class="p-4 bg-slate-50 border rounded-xl">
                <input type="number" [(ngModel)]="newIngredient.cost" placeholder="Coste" class="p-4 bg-slate-50 border rounded-xl">
              </div>
              <input type="number" [(ngModel)]="newIngredient.minStock" placeholder="Stock Mínimo Alerta" class="w-full p-4 bg-slate-50 border rounded-xl">
              <div class="flex gap-4 pt-4">
                <button (click)="showIngredientModal = false" class="flex-1 py-4 text-slate-400 font-bold">Cerrar</button>
                <button (click)="createIngredient()" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Añadir</button>
              </div>
           </div>
        </div>
      </div>

      <div *ngIf="showWarehouseModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
           <h3 class="text-2xl font-black text-slate-800 mb-6">Nuevo Almacén</h3>
           <input [(ngModel)]="newWarehouseName" placeholder="Nombre (Ej: Barra Principal)" class="w-full p-4 bg-slate-50 border rounded-xl mb-4">
           <div class="flex gap-4">
             <button (click)="showWarehouseModal = false" class="flex-1 py-4 text-slate-400 font-bold">Cerrar</button>
             <button (click)="createWarehouse()" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Crear</button>
           </div>
        </div>
      </div>

      <!-- Modales existentes de Productos y Categorías adaptados... -->
      <div *ngIf="showCategoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm flex">
        <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
          <input [(ngModel)]="newCategoryName" placeholder="Nueva Categoría" class="w-full p-4 bg-slate-50 border rounded-xl mb-4">
          <div class="flex gap-4">
              <button (click)="showCategoryModal = false" class="flex-1 py-4 text-slate-400 font-bold">Cerrar</button>
              <button (click)="createCategory()" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold">Guardar</button>
          </div>
        </div>
      </div>

      <div *ngIf="showProductModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl">
          <input [(ngModel)]="newProduct.name" placeholder="Nombre" class="w-full p-4 bg-slate-50 border rounded-xl mb-3">
          <div class="grid grid-cols-2 gap-4 mb-3">
             <input type="number" [(ngModel)]="newProduct.price" placeholder="Precio" class="p-4 bg-slate-50 border rounded-xl">
             <select [(ngModel)]="newProduct.categoryId" class="p-4 bg-slate-50 border rounded-xl">
               <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
             </select>
          </div>
          <textarea [(ngModel)]="newProduct.description" placeholder="Descripción" class="w-full p-4 bg-slate-50 border rounded-xl h-24 mb-6"></textarea>
          <div class="flex gap-4">
            <button (click)="closeProductModal()" class="flex-1 py-4 text-slate-400 font-bold">Cerrar</button>
            <button (click)="saveProduct()" class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-soft">Guardar Producto</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class InventoryComponent implements OnInit {
  currentTab: 'products' | 'warehouses' | 'ingredients' = 'products';
  
  // Datos Generales
  categories: Category[] = [];
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  ingredients: Ingredient[] = [];
  warehouseStocks: Stock[] = [];

  // Estado Selección
  selectedCategoryId: string | null = null;
  selectedWarehouse: Warehouse | null = null;
  editingProductForRecipe: Product | null = null;
  recipeItems: RecipeItem[] = [];

  // Modales y Formularios
  showCategoryModal = false;
  showProductModal = false;
  showWarehouseModal = false;
  showIngredientModal = false;
  showRecipeModal = false;

  newCategoryName = '';
  newWarehouseName = '';
  newIngredient: Partial<Ingredient> = { name: '', unit: 'kg', cost: 0, minStock: 0 };
  newProduct: Partial<Product> = { name: '', price: 0, categoryId: '', description: '' };
  
  isEditing = false;
  editingProductId: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.inventoryService.getCategories().subscribe(res => this.categories = res);
    this.inventoryService.getProducts().subscribe(res => this.products = res);
    this.inventoryService.getWarehouses().subscribe(res => {
      this.warehouses = res;
      if (res.length > 0 && !this.selectedWarehouse) {
        this.selectWarehouse(res[0]);
      }
    });
    this.inventoryService.getIngredients().subscribe(res => this.ingredients = res);
  }

  // --- LOGICA PRODUCTOS ---
  selectCategory(id: string | null) {
    this.selectedCategoryId = id;
    this.inventoryService.getProducts(id || undefined).subscribe(res => this.products = res);
  }

  getSelectedCategoryName() {
    if (!this.selectedCategoryId) return 'Todos los Artículos';
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name || 'Artículos';
  }

  saveProduct() {
    const action = this.isEditing && this.editingProductId 
      ? this.inventoryService.updateProduct(this.editingProductId, this.newProduct)
      : this.inventoryService.createProduct(this.newProduct);

    action.subscribe(() => {
      this.closeProductModal();
      this.selectCategory(this.selectedCategoryId);
    });
  }

  editProduct(product: Product) {
    this.newProduct = { ...product };
    this.isEditing = true;
    this.editingProductId = product.id;
    this.showProductModal = true;
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar producto de la carta?')) {
      this.inventoryService.deleteProduct(id).subscribe(() => this.selectCategory(this.selectedCategoryId));
    }
  }

  closeProductModal() {
    this.showProductModal = false;
    this.isEditing = false;
    this.newProduct = { name: '', price: 0, categoryId: '', description: '' };
  }

  createCategory() {
    if (this.newCategoryName) {
      this.inventoryService.createCategory(this.newCategoryName).subscribe(() => {
        this.showCategoryModal = false;
        this.newCategoryName = '';
        this.loadAll();
      });
    }
  }

  // --- LOGICA ALMACENES Y STOCK ---
  selectWarehouse(wh: Warehouse) {
    this.selectedWarehouse = wh;
    this.inventoryService.getStock(wh.id).subscribe(res => this.warehouseStocks = res);
  }

  createWarehouse() {
    if (this.newWarehouseName) {
      this.inventoryService.createWarehouse(this.newWarehouseName).subscribe(() => {
        this.showWarehouseModal = false;
        this.newWarehouseName = '';
        this.loadAll();
      });
    }
  }

  openAdjustmentDialog(stock: Stock) {
    const newQty = prompt(`Ajustar stock de ${stock.ingredient?.name} en ${this.selectedWarehouse?.name}. Cantidad actual: ${stock.quantity}`, stock.quantity.toString());
    if (newQty !== null) {
      this.inventoryService.adjustStock(stock.warehouseId, stock.ingredientId, +newQty).subscribe(() => {
        this.selectWarehouse(this.selectedWarehouse!);
      });
    }
  }

  // --- LOGICA INGREDIENTES ---
  createIngredient() {
    this.inventoryService.createIngredient(this.newIngredient).subscribe(() => {
      this.showIngredientModal = false;
      this.newIngredient = { name: '', unit: 'kg', cost: 0, minStock: 0 };
      this.loadAll();
    });
  }

  // --- LOGICA RECETAS (ESCANDALLOS) ---
  openRecipeEditor(product: Product) {
    this.editingProductForRecipe = product;
    this.inventoryService.getRecipe(product.id).subscribe(res => {
      this.recipeItems = res;
      this.showRecipeModal = true;
    });
  }

  addIngredientToRecipe(ingId: string, qty: number) {
    if (!qty) return;
    const existing = this.recipeItems.find(i => i.ingredientId === ingId);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.recipeItems.push({ ingredientId: ingId, quantity: qty });
    }
  }

  saveRecipe() {
    if (!this.editingProductForRecipe) return;
    this.inventoryService.updateRecipe(this.editingProductForRecipe.id, this.recipeItems).subscribe(() => {
      this.showRecipeModal = false;
      alert('Ficha técnica actualizada correctamente');
    });
  }

  getIngredientName(id: string) { return this.ingredients.find(i => i.id === id)?.name || 'Desconocido'; }
  getIngredientUnit(id: string) { return this.ingredients.find(i => i.id === id)?.unit || ''; }
  getIngredientCost(id: string) { return this.ingredients.find(i => i.id === id)?.cost || 0; }

  calculateTotalCost() {
    return this.recipeItems.reduce((acc, item) => {
      const cost = this.getIngredientCost(item.ingredientId);
      return acc + (cost * item.quantity);
    }, 0);
  }
}

