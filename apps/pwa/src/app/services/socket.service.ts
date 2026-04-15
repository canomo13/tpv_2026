import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private newOrderSubject = new Subject<any>();
  private statusChangeSubject = new Subject<any>();

  constructor() {
    // URL del backend (ajusta si es necesario para producción)
    this.socket = io('http://localhost:3000');

    this.socket.on('new-order', (data) => {
      this.newOrderSubject.next(data);
    });

    this.socket.on('order-status-changed', (data) => {
      this.statusChangeSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.socket.emit('join-kitchen');
    });
  }

  onNewOrder(): Observable<any> {
    return this.newOrderSubject.asObservable();
  }

  onStatusChange(): Observable<any> {
    return this.statusChangeSubject.asObservable();
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }
}
