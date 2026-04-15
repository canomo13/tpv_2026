import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './inventory.service';

export interface TicketItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  status: string; // PENDING, PREPARING, READY, SERVED
  notes?: string;
}

export interface Ticket {
  id: string;
  tableId: string;
  userId: string;
  total: number;
  status: string;
  items: TicketItem[];
  table?: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/orders'; // Ajustar si hay prefijo /api

  constructor(private http: HttpClient) {}

  getActiveTicket(tableId: string, userId: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/active-ticket`, { tableId, userId });
  }

  addItem(ticketId: string, productId: string, quantity: number, notes?: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/add-item`, { ticketId, productId, quantity, notes });
  }

  getKitchenOrders(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/kitchen`);
  }

  updateItemStatus(itemId: string, status: string): Observable<TicketItem> {
    return this.http.patch<TicketItem>(`${this.apiUrl}/item/${itemId}/status`, { status });
  }

  payTicket(ticketId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ticketId}/close`, {});
  }
}

