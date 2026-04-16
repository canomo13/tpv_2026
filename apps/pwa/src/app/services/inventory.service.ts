import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: string;
  name: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
  category?: Category;
}

export interface Warehouse {
  id: string;
  name: string;
  _count?: { stocks: number };
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  cost: number;
  minStock: number;
}

export interface Stock {
  id: string;
  warehouseId: string;
  ingredientId: string;
  quantity: number;
  ingredient?: Ingredient;
}

export interface RecipeItem {
  ingredientId: string;
  quantity: number;
  ingredient?: Ingredient;
}


@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:3000/api/inventory';

  constructor(private http: HttpClient) {}

  // --- CATEGORÍAS ---
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categories`, { name });
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categories/${id}`);
  }

  // --- PRODUCTOS ---
  getProducts(categoryId?: string): Observable<Product[]> {
    const url = categoryId ? `${this.apiUrl}/products?categoryId=${categoryId}` : `${this.apiUrl}/products`;
    return this.http.get<Product[]>(url);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  // --- ALMACENES ---
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}/warehouses`);
  }

  createWarehouse(name: string): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.apiUrl}/warehouses`, { name });
  }

  // --- INGREDIENTES ---
  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
  }

  createIngredient(ingredient: Partial<Ingredient>): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.apiUrl}/ingredients`, ingredient);
  }

  // --- STOCK ---
  getStock(warehouseId: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/stock/${warehouseId}`);
  }

  adjustStock(warehouseId: string, ingredientId: string, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock/adjust`, { warehouseId, ingredientId, quantity });
  }

  transferStock(data: { sourceWarehouseId: string, targetWarehouseId: string, ingredientId: string, quantity: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock/transfer`, data);
  }

  // --- RECETAS ---
  getRecipe(productId: string): Observable<RecipeItem[]> {
    return this.http.get<RecipeItem[]>(`${this.apiUrl}/products/${productId}/recipe`);
  }

  updateRecipe(productId: string, ingredients: RecipeItem[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${productId}/recipe`, { ingredients });
  }
}

