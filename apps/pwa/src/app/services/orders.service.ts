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
}

export interface Ticket {
  id: string;
  tableId: string;
  userId: string;
  total: number;
  status: string;
  items: TicketItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  getActiveTicket(tableId: string, userId: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/active-ticket/${tableId}?userId=${userId}`);
  }

  addItem(ticketId: string, productId: string, quantity: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/items`, { ticketId, productId, quantity });
  }

  payTicket(ticketId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/pay/${ticketId}`, {});
  }
}
