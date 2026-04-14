import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, Category, Product } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col lg:flex-row h-full gap-10 animate-slide-up">
      <!-- Sidebar de Categorías Pastel -->
      <aside class="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div class="glass-panel p-8 rounded-[2.5rem] flex flex-col gap-8 shadow-soft border-white/40">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <h2 class="text-sm font-display font-bold text-indigo-500 uppercase tracking-[0.2em]">Categorías</h2>
              <p class="text-xs text-slate-400 font-medium">Organiza tu carta</p>
            </div>
            <button (click)="showCategoryModal = true" class="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 hover:bg-white transition-all shadow-sm">
               <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <button 
              (click)="selectCategory(null)"
              [class.bg-indigo-600]="!selectedCategoryId"
              [class.text-white]="!selectedCategoryId"
              [class.shadow-lg]="!selectedCategoryId"
              [class.shadow-indigo-200]="!selectedCategoryId"
              class="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-sm font-bold hover:bg-white/60 text-slate-600">
              <span>Todas</span>
              <span class="px-2 py-0.5 bg-white/20 rounded-lg text-[10px]">{{ allProductsCount }}</span>
            </button>
            
            <div *ngFor="let cat of categories" class="group relative">
              <button 
                (click)="selectCategory(cat.id)"
                [class.bg-white]="selectedCategoryId === cat.id"
                [class.shadow-soft]="selectedCategoryId === cat.id"
                [class.text-indigo-600]="selectedCategoryId === cat.id"
                class="w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 text-sm font-bold text-slate-600 hover:bg-white/40">
                <span>{{ cat.name }}</span>
                <span class="px-2 py-0.5 bg-slate-100 rounded-lg text-[10px] group-hover:bg-indigo-50 transition-colors">{{ cat._count?.products || 0 }}</span>
              </button>
              <button (click)="deleteCategory(cat.id)" class="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 opacity-0 group-hover:opacity-100 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500 hover:text-white">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Almacén Shortcut -->
        <div class="glass-panel p-6 rounded-[2rem] bg-indigo-50/50 border-indigo-100 hidden lg:block">
           <div class="flex items-center space-x-4">
             <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-400 shadow-sm border border-indigo-50">
               <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
             </div>
             <div class="flex flex-col">
               <span class="text-[10px] uppercase font-black text-slate-400">Acceso Rápido</span>
               <span class="text-xs font-bold text-slate-700">Stock de Cocina</span>
             </div>
           </div>
        </div>
      </aside>
      
      <!-- Main Content: Products Grid -->
      <div class="flex-1 flex flex-col gap-6">
        <div class="flex items-center justify-between">
            <h2 class="text-2xl font-display font-bold text-slate-800">
               {{ getSelectedCategoryName() }}
            </h2>
            <button (click)="showProductModal = true" class="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all">
               <svg width="18" height="18" class="mr-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>
               Nuevo Producto
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div *ngFor="let product of products" class="glass-card p-6 rounded-[2.5rem] flex flex-col gap-4 group">
            <div class="w-full aspect-square bg-slate-50 rounded-[2rem] overflow-hidden relative border border-slate-100">
               <div class="absolute inset-0 flex items-center justify-center text-slate-200">
                 <svg width="60" height="60" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"></path></svg>
               </div>
               <div class="absolute top-4 right-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-bold text-indigo-500 shadow-sm border border-white">
                 {{ product.price | currency:'EUR' }}
               </div>
            </div>
            <div class="flex flex-col gap-1">
              <h3 class="font-bold text-slate-800 text-lg">{{ product.name }}</h3>
              <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">{{ product.description || 'Sin descripción disponible' }}</p>
            </div>
            <div class="flex items-center justify-between pt-2">
              <div class="h-8 px-3 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] uppercase font-bold flex items-center">
                {{ product.category?.name }}
              </div>
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button (click)="editProduct(product)" class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                </button>
                <button (click)="deleteProduct(product.id)" class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="products.length === 0" class="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
            <svg width="80" height="80" class="mb-4 opacity-50" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            <p class="font-bold text-lg">No hay productos en esta categoría</p>
            <p class="text-sm">Empieza añadiendo tu primer artículo</p>
          </div>
        </div>
      </div>

      <!-- Modal Categoría Pastel -->
      <div *ngIf="showCategoryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-slide-up border border-white">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col">
              <h3 class="text-2xl font-display font-bold text-slate-800">Nueva Categoría</h3>
              <p class="text-sm text-slate-400">Nombra la nueva sección de tu carta</p>
            </div>
            <input [(ngModel)]="newCategoryName" 
                   placeholder="Ej: Bebidas, Postres..." 
                   class="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all">
            <div class="flex gap-4">
              <button (click)="showCategoryModal = false" class="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
              <button (click)="createCategory()" 
                      [disabled]="!newCategoryName"
                      class="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 disabled:opacity-50">
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Producto Pastel -->
      <div *ngIf="showProductModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <div class="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl animate-slide-up border border-white">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col">
              <h3 class="text-2xl font-display font-bold text-slate-800">Nuevo Artículo</h3>
              <p class="text-sm text-slate-400">Detalla los datos del nuevo producto</p>
            </div>
            
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-black text-slate-400 ml-2">Nombre del producto</label>
                <input [(ngModel)]="newProduct.name" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] uppercase font-black text-slate-400 ml-2">Precio (€)</label>
                  <input type="number" [(ngModel)]="newProduct.price" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold">
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[10px] uppercase font-black text-slate-400 ml-2">Categoría</label>
                  <select [(ngModel)]="newProduct.categoryId" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold appearance-none">
                    <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[10px] uppercase font-black text-slate-400 ml-2">Descripción</label>
                <textarea [(ngModel)]="newProduct.description" class="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl resize-none h-24"></textarea>
              </div>
            </div>

            <div class="flex gap-4">
              <button (click)="closeProductModal()" class="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
              <button (click)="saveProduct()" 
                      [disabled]="!newProduct.name || !newProduct.price || !newProduct.categoryId"
                      class="flex-1 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-indigo-100 disabled:opacity-50">
                Añadir a la Carta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class InventoryComponent implements OnInit {
  categories: Category[] = [];
  products: Product[] = [];
  selectedCategoryId: string | null = null;
  allProductsCount = 0;

  // Modales
  showCategoryModal = false;
  showProductModal = false;
  newCategoryName = '';
  newProduct: Partial<Product> = { name: '', price: 0, categoryId: '', description: '' };
  isEditing = false;
  editingProductId: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inventoryService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
    this.loadProducts();
  }

  loadProducts() {
    this.inventoryService.getProducts(this.selectedCategoryId || undefined).subscribe(products => {
      this.products = products;
      if (!this.selectedCategoryId) {
        this.allProductsCount = products.length;
      }
    });
  }

  selectCategory(id: string | null) {
    this.selectedCategoryId = id;
    this.loadProducts();
  }

  getSelectedCategoryName() {
    if (!this.selectedCategoryId) return 'Todos los Artículos';
    return this.categories.find(c => c.id === this.selectedCategoryId)?.name || 'Artículos';
  }

  createCategory() {
    if (this.newCategoryName) {
      this.inventoryService.createCategory(this.newCategoryName).subscribe(() => {
        this.newCategoryName = '';
        this.showCategoryModal = false;
        this.loadData();
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados podrían quedar sin categoría.')) {
      this.inventoryService.deleteCategory(id).subscribe(() => {
        this.loadData();
      });
    }
  }

  saveProduct() {
    if (this.isEditing && this.editingProductId) {
      this.inventoryService.updateProduct(this.editingProductId, this.newProduct).subscribe(() => {
        this.closeProductModal();
        this.loadProducts();
      });
    } else {
      this.inventoryService.createProduct(this.newProduct).subscribe(() => {
        this.closeProductModal();
        this.loadProducts();
      });
    }
  }

  editProduct(product: Product) {
    this.newProduct = { ...product };
    this.isEditing = true;
    this.editingProductId = product.id;
    this.showProductModal = true;
  }

  deleteProduct(id: string) {
    if (confirm('¿Eliminar producto de la carta?')) {
      this.inventoryService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  closeProductModal() {
    this.showProductModal = false;
    this.isEditing = false;
    this.editingProductId = null;
    this.newProduct = { name: '', price: 0, categoryId: '', description: '' };
  }
}
