import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Shift {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private apiUrl = 'http://localhost:3000/shifts';
  
  // Estado reactivo del turno actual
  currentShift = signal<Shift | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Cargar el estado del turno actual del servidor
   */
  loadCurrentShift(): Observable<Shift | null> {
    return this.http.get<Shift | null>(`${this.apiUrl}/current`).pipe(
      tap(shift => this.currentShift.set(shift))
    );
  }

  /**
   * Iniciar Jornada
   */
  clockIn(): Observable<Shift> {
    return this.http.post<Shift>(`${this.apiUrl}/clock-in`, {}).pipe(
      tap(shift => this.currentShift.set(shift))
    );
  }

  /**
   * Finalizar Jornada
   */
  clockOut(): Observable<Shift> {
    return this.http.post<Shift>(`${this.apiUrl}/clock-out`, {}).pipe(
      tap(() => this.currentShift.set(null))
    );
  }

  /**
   * Getter simple para saber si hay turno activo
   */
  hasActiveShift(): boolean {
    return this.currentShift() !== null && !this.currentShift()?.endTime;
  }
}
