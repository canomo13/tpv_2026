// --- USUARIOS Y TURNOS ---
export type Role = 'ADMIN' | 'WAITER' | 'WAREHOUSE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
}

// --- INVENTARIO ---
export interface Warehouse {
  id: string;
  name: string;
}

export interface Stock {
  id: string;
  warehouseId: string;
  ingredientId?: string;
  productId?: string;
  quantity: number;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  cost: number;
  minStock: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId: string;
}

export interface RecipeItem {
  id: string;
  productId: string;
  ingredientId: string;
  quantity: number;
}

// --- DISEÑO DE PLANTA ---
export interface Zone {
  id: string;
  name: string;
}

export interface Table {
  id: string;
  number: number;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle';
  status: 'free' | 'occupied' | 'reserved';
  zoneId: string;
}

// --- TICKETS Y FISCALIDAD ---
export interface Ticket {
  id: string;
  ticketNumber: number;
  tableId?: string;
  userId: string;
  total: number;
  status: string;
  prevHash?: string;
  currentHash: string;
  signature?: string;
  chainIndex: number;
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  ticketId: string;
  productId: string;
  quantity: number;
  price: number;
}

// --- DTOs (Data Transfer Objects) ---
export interface CreateTicketDto {
  tableId?: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateTableLayoutDto {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  shape?: 'rect' | 'circle';
}
